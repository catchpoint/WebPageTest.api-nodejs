import { afterEach, describe, expect, it, vi } from 'vitest';

import { WebPageTest, WebPageTestError } from '../src/index.js';

afterEach(() => vi.unstubAllGlobals());

describe('instant test status', () => {
  it.each([
    { statusTypeId: 1, queuePosition: 0 },
    { statusTypeId: 999, queuePosition: null },
    {},
  ])('gets once without a body and preserves response data: %j', async (data) => {
    const response = {
      data: { ...data, hasMore: false, next: null, previous: null, additionalField: true },
      completed: true, messages: [], errors: null, traceId: 'example', usageLimits: { runs: { day: 1 } },
    };
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify(response)));
    vi.stubGlobal('fetch', fetchMock);
    const client = new WebPageTest({ apiKey: 'test-key', baseUrl: 'https://example.test' });
    await expect(client.instantTests.status(42)).resolves.toEqual(response);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url.href).toBe('https://example.test/api/v4/webpagetest/results/42/status');
    expect(init.method).toBe('GET');
    expect(init.body).toBeUndefined();
  });

  it('returns HTTP failures without retrying', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('{}', { status: 503 }));
    vi.stubGlobal('fetch', fetchMock);
    await expect(new WebPageTest({ apiKey: 'test-key' }).instantTests.status(42)).rejects.toBeInstanceOf(WebPageTestError);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
