import { afterEach, describe, expect, it, vi } from 'vitest';

import { WebPageTest } from '../src/index.js';

describe('screenshot and response-body operations', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('retrieves the first available screenshot as JSON', async () => {
    const payload = { data: { screenshot: { image: 'AAEC', format: 'png' } }, traceId: 'trace-123' };
    const fetchMock = vi.fn().mockResolvedValue(Response.json(payload));
    vi.stubGlobal('fetch', fetchMock);

    const response = await new WebPageTest({ apiKey: 'test-key', baseUrl: 'https://example.test' }).instantTests.screenshot(123);

    expect(response).toEqual(payload);
    const [url, init] = fetchMock.mock.calls[0] as [URL, RequestInit];
    expect(url.pathname).toBe('/api/v4/webpagetest/results/123/screenshot');
    expect(url.search).toBe('');
    expect(init.method).toBeUndefined();
    expect(new Headers(init.headers).get('Accept')).toBe('application/json');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('downloads the selected request body as raw bytes', async () => {
    const bytes = Uint8Array.from([0, 10, 255]);
    const fetchMock = vi.fn().mockResolvedValue(new Response(bytes, {
      headers: { 'content-type': 'text/html' },
    }));
    vi.stubGlobal('fetch', fetchMock);

    const body = await new WebPageTest({ apiKey: 'test-key', baseUrl: 'https://example.test' })
      .instantTests.downloadResponseBody(123, 'request/1', { run: 2, cached: false, step: 0 });

    expect(body).toEqual({ data: bytes, contentType: 'text/html' });
    const [url, init] = fetchMock.mock.calls[0] as [URL, RequestInit];
    expect(url.pathname).toBe('/api/v4/webpagetest/results/123/responseBody');
    expect(Object.fromEntries(url.searchParams)).toEqual({ requestId: 'request/1', run: '2', cached: 'false', step: '0' });
    expect(init.method).toBeUndefined();
    expect(new Headers(init.headers).get('Accept')).toBe('*/*');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('omits optional response-body filters and preserves a missing content type', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null));
    vi.stubGlobal('fetch', fetchMock);

    const body = await new WebPageTest({ apiKey: 'test-key' }).instantTests.downloadResponseBody(123, 'request-1');

    expect(body).toEqual({ data: new Uint8Array(), contentType: null });
    const url = fetchMock.mock.calls[0]?.[0] as URL;
    expect(Object.fromEntries(url.searchParams)).toEqual({ requestId: 'request-1' });
  });

  it('preserves HTTP errors from response-body downloads', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('missing', {
      status: 404,
      headers: { 'x-trace-id': 'trace-123' },
    }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(new WebPageTest({ apiKey: 'test-key' }).instantTests.downloadResponseBody(123, 'request-1'))
      .rejects.toMatchObject({ name: 'WebPageTestError', status: 404, traceId: 'trace-123', cause: 'missing' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
