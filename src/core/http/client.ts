import { WebPageTestError } from '../errors/errors.js';

import type { InternalWebPageTestConfig } from '../config/config.js';

export class HttpClient {
  constructor(
    private readonly config: InternalWebPageTestConfig,
    private readonly apiBasePath: string,
  ) {}

  async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const response = await this.send(path, init, 'application/json');
    const body = await this.readBody(response, () => response.json());
    return body as T;
  }

  /** Reads the complete response into memory as bytes. */
  async download(path: string, init: RequestInit = {}) {
    const response = await this.send(path, init, '*/*');
    const buffer = await this.readBody(response, () => response.arrayBuffer());
    return {
      data: new Uint8Array(buffer),
      contentType: response.headers.get('content-type'),
    };
  }

  private async send(path: string, init: RequestInit, accept: string): Promise<Response> {
    const url = this.buildUrl(path);
    const headers = this.buildHeaders(init.headers, init.body, accept);
    this.config.logger?.debug('WebPageTest API request started.');
    const response = await this.fetchOnce(url, { ...init, headers });
    if (!response.ok) {
      const errorBody = await this.readBody(response, () => response.text());
      const errorMessage = `WebPageTest API returned HTTP ${response.status}.`;
      this.config.logger?.error(errorMessage);
      throw new WebPageTestError(
        errorMessage,
        response.status,
        response.headers.get('x-trace-id') ?? undefined,
        errorBody,
      );
    }
    this.config.logger?.debug(`WebPageTest API response received (HTTP ${response.status}).`);
    return response;
  }

  private buildUrl(path: string): URL {
    const normalizedPath = path.replace(/^\//, '');
    return new URL(
      `${this.apiBasePath}/${normalizedPath}`,
      this.config.baseUrl,
    );
  }

  private buildHeaders(input: HeadersInit | undefined, body: BodyInit | null | undefined, accept: string): Headers {
    const headers = new Headers(input);
    headers.set('Accept', accept);
    headers.set('Authorization', `Bearer ${this.config.apiKey}`);

    if (body && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    return headers;
  }

  private async fetchOnce(url: URL, init: RequestInit): Promise<Response> {
    try {
      return await fetch(url, {
        ...init,
        signal: init.signal
          ? AbortSignal.any([init.signal, AbortSignal.timeout(this.config.requestTimeoutMs)])
          : AbortSignal.timeout(this.config.requestTimeoutMs),
      });
    } catch (error) {
      this.config.logger?.error('WebPageTest API request failed.');
      throw new WebPageTestError('Request failed', undefined, undefined, error);
    }
  }

  private async readBody<T>(response: Response, reader: () => Promise<T>): Promise<T> {
    try {
      return await reader();
    } catch (error) {
      const message = response.ok
        ? 'Failed to read WebPageTest API response'
        : `WebPageTest API returned HTTP ${response.status}`;
      this.config.logger?.error(message);
      throw new WebPageTestError(message, response.status, response.headers.get('x-trace-id') ?? undefined, error);
    }
  }
}
