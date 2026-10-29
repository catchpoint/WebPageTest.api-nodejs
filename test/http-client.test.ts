import { afterEach, describe, expect, it, vi } from 'vitest';

import { HttpClient } from '../src/core/http/client.js';
import { parseConfig } from '../src/core/config/config.js';

const SUCCESS_RESPONSE = { data: {} };

describe('HttpClient failures', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('preserves HTTP context when a successful JSON response is malformed', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('not-json', { status: 200, headers: { 'x-trace-id': 'trace' } }));
    vi.stubGlobal('fetch', fetchMock);
    const client = new HttpClient(parseConfig({ apiKey: 'test-key' }), '/api/v4/webpagetest');
    await expect(client.request('nodes')).rejects.toMatchObject({ name: 'WebPageTestError', status: 200, traceId: 'trace', cause: expect.any(SyntaxError) });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('preserves HTTP context and the response text for a failed JSON request', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('not-json', { status: 503, headers: { 'x-trace-id': 'trace' } }));
    vi.stubGlobal('fetch', fetchMock);
    const client = new HttpClient(parseConfig({ apiKey: 'test-key' }), '/api/v4/webpagetest');
    await expect(client.request('nodes')).rejects.toMatchObject({ name: 'WebPageTestError', status: 503, traceId: 'trace', cause: 'not-json' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('preserves HTTP context when reading an error response fails', async () => {
    const readError = new Error('body read failed');
    const response = new Response('error', { status: 503, headers: { 'x-trace-id': 'trace' } });
    vi.spyOn(response, 'text').mockRejectedValue(readError);
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));
    const client = new HttpClient(parseConfig({ apiKey: 'test-key' }), '/api/v4/webpagetest');

    await expect(client.request('nodes')).rejects.toMatchObject({ name: 'WebPageTestError', status: 503, traceId: 'trace', cause: readError });
  });

  it.each(['AbortError', 'TimeoutError', 'TypeError'])('propagates body read failures: %s', async (name) => {
    const error = new Error('body read failed');
    error.name = name;
    const response = new Response('{}', { headers: { 'x-trace-id': 'trace' } });
    vi.spyOn(response, 'json').mockRejectedValue(error);
    const fetchMock = vi.fn().mockResolvedValue(response);
    vi.stubGlobal('fetch', fetchMock);
    const client = new HttpClient(parseConfig({ apiKey: 'test-key' }), '/api/v4/webpagetest');
    await expect(client.request('nodes')).rejects.toMatchObject({ name: 'WebPageTestError', status: 200, traceId: 'trace', cause: error });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('returns an HTTP error after one POST attempt', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ error: 'temporary' }), { status: 503 }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const client = new HttpClient(
      { ...parseConfig({ apiKey: 'test-key', baseUrl: 'https://example.test' }), requestTimeoutMs: 1000 },
      '/api/v4/webpagetest',
    );

    await expect(client.request('test', { method: 'POST', body: '{}' })).rejects.toThrow('HTTP 503');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('returns an HTTP error after one GET attempt', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify(SUCCESS_RESPONSE), { status: 503 }),
    );
    vi.stubGlobal('fetch', fetchMock);

    const client = new HttpClient(
      { ...parseConfig({ apiKey: 'test-key', baseUrl: 'https://example.test' }), requestTimeoutMs: 1000 },
      '/api/v4/webpagetest',
    );

    await expect(client.request('nodes')).rejects.toThrow('HTTP 503');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
