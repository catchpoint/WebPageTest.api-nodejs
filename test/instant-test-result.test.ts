import { afterEach, describe, expect, it, vi } from 'vitest';

import { WebPageTest, WebPageTestError } from '../src/index.js';

const createClient = () => new WebPageTest({ apiKey: 'test-key', baseUrl: 'https://example.test' });
const response = {
  data: {
    id: '42', createDate: '2026-10-01T21:34:41.553', testRuns: 1,
    runs: [{
      run: 1, viewType: { id: 1, name: 'FirstView' }, stepNum: 1, timeToFirstByte: 120.5,
      largestContentfulPaint: 850, totalBlockingTime: null,
      requests: [{ responseCode: 200, dnsTiming: { start: 0, value: 10.5 }, chunks: [{ start: 20, value: 5 }] }],
      videoFrames: [{ time: 100, image: 'aW1hZ2U=', visuallyComplete: 75.5 }],
      customMetrics: [{ name: 'example', value: '12' }],
      layoutShifts: [{ score: 0.01, rects: [[0, 1, 2, 3]], sources: [{ previousRect: { x: 0, width: 10 } }] }],
      cpuTimes: { breakDown: [{ category: 'script', time: 5 }] },
      consoleLog: [{ text: 'example', lineNumber: null }],
    }],
    lighthouse: {
      categories: { performance: { score: 0.95, auditRefs: [{ id: 'paint', weight: 10 }] } },
      audits: { paint: { score: null, numericValue: 850, details: { debugData: { nested: { value: 1 } }, nodes: [{ name: 'example', children: [{ resourceBytes: 20 }] }] } } },
    },
    crux: { metrics: [{ key: 'largest_contentful_paint', metric: { percentiles: { p75: 1000 } } }] },
    hasMore: false,
  },
  completed: true, usageLimits: { runs: { day: 1 } },
};

function mockResponse(body: unknown) {
  const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify(body)));
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

afterEach(() => vi.unstubAllGlobals());

describe('instant test result', () => {
  it('preserves enumeration objects in run metrics, medians, and waterfall data', async () => {
    const data = {
      runs: [{
        viewType: { id: 1, name: 'FirstView' },
        pageEvents: [{ metricType: { id: 116, name: 'LargestContentfulPaint' }, start: 850, duration: 0 }],
        requests: [{ contentType: { id: 2, name: 'Html' }, status: { id: 0, name: 'Success' } }],
      }],
      medians: [{ type: { id: 116, name: 'LargestContentfulPaint' }, index: 0 }],
    };
    mockResponse({ data });
    await expect(createClient().instantTests.result(42, { includeWaterfall: true })).resolves.toEqual({ data });
  });

  it.each([{ id: 0 }, { id: 1 }, { id: 1, name: null }])('supports enum objects with optional names: %j', async (value) => {
    const data = {
      runs: [{ viewType: value, pageEvents: [{ metricType: value }], requests: [{ contentType: value, status: value }] }],
      medians: [{ type: value }],
    };
    mockResponse({ data });
    await expect(createClient().instantTests.result(42)).resolves.toEqual({ data });
  });

  it('preserves nested result data without default query parameters', async () => {
    const fetchMock = mockResponse(response);
    await expect(createClient().instantTests.result(42)).resolves.toEqual(response);
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url.href).toBe('https://example.test/api/v4/webpagetest/results/42');
    expect(init.method ?? 'GET').toBe('GET');
    expect(init.body).toBeUndefined();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('serializes filters including false and omits undefined options', async () => {
    const fetchMock = mockResponse({ data: {} });
    await createClient().instantTests.result(42, { run: 1, includeWaterfall: true, includeFilmstrip: false, includeLighthouse: undefined });
    expect(Object.fromEntries(fetchMock.mock.calls[0]![0].searchParams)).toEqual({ run: '1', includeWaterfall: 'true', includeFilmstrip: 'false' });
  });

  it('supports the Lighthouse filter and identifiers beyond int32', async () => {
    const fetchMock = mockResponse({ data: {} });
    await createClient().instantTests.result(3_000_000_000, { includeLighthouse: true });
    expect(fetchMock.mock.calls[0]![0].href).toBe('https://example.test/api/v4/webpagetest/results/3000000000?includeLighthouse=true');
  });

  it.each([{}, { runs: null }, { runs: [] }, { id: null, labels: null, runs: [{ requests: null, videoFrames: null, customMetrics: null }] }])('accepts optional and nullable fields: %j', async (data) => {
    mockResponse({ data });
    await expect(createClient().instantTests.result(42)).resolves.toEqual({ data });
  });

  it('returns HTTP failures without retrying or polling', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('{}', { status: 503 }));
    vi.stubGlobal('fetch', fetchMock);
    await expect(createClient().instantTests.result(42)).rejects.toBeInstanceOf(WebPageTestError);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
