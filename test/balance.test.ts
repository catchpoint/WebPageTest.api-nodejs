import { afterEach, describe, expect, it, vi } from 'vitest';

import { WebPageTest } from '../src/index.js';

describe('balance', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('returns the remaining run balance with shared response metadata', async () => {
    const payload = { data: { balance: 42 }, traceId: 'trace-123' };
    const fetchMock = vi.fn().mockResolvedValue(Response.json(payload));
    vi.stubGlobal('fetch', fetchMock);

    const response = await new WebPageTest({ apiKey: 'test-key', baseUrl: 'https://example.test' }).balance.get();

    expect(response).toEqual(payload);
    const [url, init] = fetchMock.mock.calls[0] as [URL, RequestInit];
    expect(url.pathname).toBe('/api/v4/webpagetest/balance');
    expect(url.search).toBe('');
    expect(init.method).toBeUndefined();
    expect(new Headers(init.headers).get('Accept')).toBe('application/json');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('preserves a null balance', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(Response.json({ data: { balance: null } })));

    const response = await new WebPageTest({ apiKey: 'test-key' }).balance.get();

    expect(response.data.balance).toBeNull();
  });

  it('returns an HTTP error after one failed request', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('unavailable', {
      status: 503,
      headers: { 'x-trace-id': 'trace-123' },
    }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(new WebPageTest({ apiKey: 'test-key' }).balance.get())
      .rejects.toMatchObject({ name: 'WebPageTestError', status: 503, traceId: 'trace-123', cause: 'unavailable' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
