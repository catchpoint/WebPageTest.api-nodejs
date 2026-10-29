import { afterEach, describe, expect, it, vi } from 'vitest';

import { WebPageTest, WebPageTestError } from '../src/index.js';

const createClient = () => new WebPageTest({ apiKey: 'test-key', baseUrl: 'https://example.test' });
const historyResponse = {
  data: {
    webpageTestHistory: [{
      id: 42,
      parentId: null,
      controlRunId: 40,
      appliedExperiments: [{ id: 7, name: null }],
      status: { id: 1, name: 'Complete' },
      url: 'https://example.com',
      node: { id: 2, name: 'Example node' },
      types: ['Performance'],
      runTime: '2026-10-01T12:00:00Z',
      runs: 1,
      labels: [{ id: null, name: null, color: null, values: ['example'] }],
    }],
    hasMore: true,
    next: 'next-page',
    previous: null,
  },
  completed: true,
  messages: [],
  errors: null,
  traceId: 'example-trace',
  usageLimits: { configCallLimit: { day: 10 } },
};

function mockResponse(body: unknown) {
  const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify(body)));
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

afterEach(() => vi.unstubAllGlobals());

describe('history', () => {
  it('lists history without adding query parameters by default', async () => {
    const fetchMock = mockResponse(historyResponse);
    await expect(createClient().history.list()).resolves.toEqual(historyResponse);
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url.href).toBe('https://example.test/api/v4/webpagetest/history');
    expect(init.body).toBeUndefined();
    expect(init.method ?? 'GET').toBe('GET');
  });

  it('serializes every filter, preserving zero and encoding search text and date offsets', async () => {
    const fetchMock = mockResponse({ data: {} });
    const query = {
      divisionId: 0,
      search: 'a & b / test?c=1',
      startTimeUtc: '2026-10-01T10:00:00+02:00',
      endTimeUtc: '2026-10-01T12:00:00Z',
      pageNumber: 2,
      pageSize: 25,
    };
    await createClient().history.list(query);
    const url = fetchMock.mock.calls[0]![0] as URL;
    expect(Object.fromEntries(url.searchParams)).toEqual(
      Object.fromEntries(Object.entries(query).map(([key, value]) => [key, String(value)])),
    );
  });

  it.each([
    '2026-10-01T21:34:41.553',
    '2026-10-01T21:34:41',
    '2026-10-01T21:34:41.5531234',
    '2026-10-01T21:34:41.553Z',
    '2026-10-01T21:34:41.553+02:00',
  ])('preserves history timestamps with or without a timezone: %s', async (runTime) => {
    const response = {
      ...historyResponse,
      data: {
        ...historyResponse.data,
        webpageTestHistory: [{ ...historyResponse.data.webpageTestHistory[0], runTime }],
      },
    };
    mockResponse(response);
    await expect(createClient().history.list()).resolves.toEqual(response);
  });

  it.each([{}, { webpageTestHistory: null }, { webpageTestHistory: [] }, {
    webpageTestHistory: [{ parentId: null, controlRunId: null, appliedExperiments: null, url: null, types: null, labels: null }],
  }])('accepts optional and nullable history data: %j', async (data) => {
    mockResponse({ data });
    await expect(createClient().history.list({ search: undefined })).resolves.toEqual({ data });
  });
});

describe('instant test rerun', () => {
  it('posts the test identifier without a body and returns the new identifier', async () => {
    const response = { data: { id: 43 }, completed: true, usageLimits: { runs: { day: 1 } } };
    const fetchMock = mockResponse(response);
    await expect(createClient().instantTests.rerun(42)).resolves.toEqual(response);
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url.href).toBe('https://example.test/api/v4/webpagetest/results/42/rerun');
    expect(init.method).toBe('POST');
    expect(init.body).toBeUndefined();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe('history and rerun failures', () => {
  it.each(['history', 'rerun'])('propagates HTTP failures once for %s', async (operation) => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('{}', { status: 503 }));
    vi.stubGlobal('fetch', fetchMock);
    const client = createClient();
    const request = operation === 'history' ? client.history.list() : client.instantTests.rerun(42);
    await expect(request).rejects.toBeInstanceOf(WebPageTestError);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
