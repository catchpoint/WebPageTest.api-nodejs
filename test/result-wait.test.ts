import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { WebPageTest, WebPageTestError } from '../src/index.js';

const client = (config: { settings?: { pollIntervalMs?: number; timeoutMs?: number } } = {}) => new WebPageTest({ apiKey: 'test-key', ...config });
const json = (body: unknown) => new Response(JSON.stringify(body));
const status = (statusTypeId: number) => json({ data: { statusTypeId }, completed: true });

beforeEach(() => vi.useFakeTimers());
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); });

describe('result waiting', () => {
  it('allows a single result call to override global waiting defaults', async () => {
    const fetchMock = vi.fn().mockImplementation(async () => status(1));
    vi.stubGlobal('fetch', fetchMock);
    const info = vi.fn();
    const endpoint = new WebPageTest({ apiKey: 'test-key', settings: { timeoutMs: 200, pollIntervalMs: 100 }, logging: { level: 'info', logger: { info, debug: vi.fn(), warn: vi.fn(), error: vi.fn() } } }).instantTests;
    const assertion = expect(endpoint.result(42, {}, { wait: true }, { timeoutMs: 50, pollIntervalMs: 10 })).rejects.toMatchObject({ code: 'TIMEOUT', testId: 42 });
    await vi.advanceTimersByTimeAsync(0);
    expect(info).toHaveBeenCalledWith(expect.stringContaining('Next check in 0.01s.'));
    await vi.advanceTimersByTimeAsync(50);
    await assertion;
    expect(fetchMock).toHaveBeenCalled();
    fetchMock.mockClear();
    const next = expect(endpoint.result(42, {}, { wait: true })).rejects.toMatchObject({ code: 'TIMEOUT' });
    await vi.advanceTimersByTimeAsync(0);
    expect(info).toHaveBeenCalledWith(expect.stringContaining('timeout: 0.2s'));
    expect(info).toHaveBeenCalledWith(expect.stringContaining('Next check in 0.1s.'));
    await vi.advanceTimersByTimeAsync(199);
    expect(fetchMock).toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    await next;
  });

  it('can resume waiting for the same ID after a timeout', async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(status(1));
    vi.stubGlobal('fetch', fetchMock);
    const endpoint = client({ settings: { timeoutMs: 50 } }).instantTests;
    const assertion = expect(endpoint.result(42, {}, { wait: true })).rejects.toMatchObject({ code: 'TIMEOUT', testId: 42 });
    await vi.advanceTimersByTimeAsync(50);
    await assertion;
    fetchMock.mockResolvedValueOnce(status(0)).mockResolvedValueOnce(json({ data: { id: '42' } }));
    await expect(endpoint.result(42, {}, { wait: true })).resolves.toEqual({ data: { id: '42' } });
    expect(fetchMock.mock.calls.every(([url]) => url.pathname.includes('/results/42'))).toBe(true);
    expect(vi.getTimerCount()).toBe(0);
  });

  it.each([{}, { wait: false }])('fetches immediately without polling by default: %j', async (options) => {
    const response = { data: { id: '42' } };
    const fetchMock = vi.fn().mockResolvedValue(json(response));
    vi.stubGlobal('fetch', fetchMock);
    await expect(client().instantTests.result(42, {}, options)).resolves.toEqual(response);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0]![0].pathname).toBe('/api/v4/webpagetest/results/42');
    expect(vi.getTimerCount()).toBe(0);
  });

  it('includes final result retrieval in the waiting deadline', async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(status(0)).mockImplementationOnce((_url, init) =>
      new Promise((_resolve, reject) => init.signal.addEventListener('abort', () => reject(init.signal.reason), { once: true })));
    vi.stubGlobal('fetch', fetchMock);
    const assertion = expect(client({ settings: { timeoutMs: 50 } }).instantTests.result(42, {}, { wait: true })).rejects.toMatchObject({ code: 'TIMEOUT', testId: 42 });
    await vi.advanceTimersByTimeAsync(50);
    await assertion;
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
  it('polls an existing test sequentially and retrieves results only after completion', async () => {
    const result = { data: { id: '42', runs: [] } };
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(status(1)).mockResolvedValueOnce(status(1))
      .mockResolvedValueOnce(status(0)).mockResolvedValueOnce(json(result));
    vi.stubGlobal('fetch', fetchMock);
    const logger = vi.fn();
    const endpoint = new WebPageTest({ apiKey: 'test-key', logging: { level: 'info', logger: { info: logger, debug: vi.fn(), warn: vi.fn(), error: vi.fn() } }, settings: { pollIntervalMs: 100 } }).instantTests;
    const createSpy = vi.spyOn(endpoint, 'create');

    const pending = endpoint.result(42, { includeWaterfall: false }, { wait: true });
    await vi.advanceTimersByTimeAsync(0);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(99);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(101);
    await expect(pending).resolves.toEqual(result);
    expect(createSpy).not.toHaveBeenCalled();
    expect(fetchMock.mock.calls[0]![1].signal).toBeInstanceOf(AbortSignal);
    expect(fetchMock.mock.calls[3]![1].signal).toBeInstanceOf(AbortSignal);

    expect(logger.mock.calls.map(([message]) => message.replace(/^\[[^\]]+\] /, ''))).toEqual([
      'Waiting for test 42 to complete (timeout: 600s).',
      'Checking status of test 42...',
      'Test 42 is running. Next check in 0.1s.',
      'Checking status of test 42...',
      'Test 42 is running. Next check in 0.1s.',
      'Checking status of test 42...',
      'Test 42 completed. Retrieving results...',
      'Results received for test 42.',
    ]);
    expect(fetchMock.mock.calls.map(([url]) => url.pathname)).toEqual([
      '/api/v4/webpagetest/results/42/status',
      '/api/v4/webpagetest/results/42/status', '/api/v4/webpagetest/results/42/status',
      '/api/v4/webpagetest/results/42',
    ]);
    expect(fetchMock.mock.calls[1]![1].method).toBe('GET');
    expect(fetchMock.mock.calls[1]![1].body).toBeUndefined();
    expect(fetchMock.mock.calls[3]![0].search).toBe('?includeWaterfall=false');
    expect(vi.getTimerCount()).toBe(0);
  });

  it.each([[4, 'TEST_TIMEOUT'], [999, 'UNKNOWN_STATUS'], [undefined, 'UNKNOWN_STATUS']])('stops for status %s', async (id, code) => {
    const fetchMock = vi.fn().mockResolvedValueOnce(json({ data: { statusTypeId: id } }));
    vi.stubGlobal('fetch', fetchMock);
    await expect(client().instantTests.result(42, {}, { wait: true })).rejects.toMatchObject({ code, testId: 42 });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('enforces the overall timeout while waiting between polls', async () => {
    const fetchMock = vi.fn().mockResolvedValue(status(1));
    vi.stubGlobal('fetch', fetchMock);
    const assertion = expect(client({ settings: { timeoutMs: 50, pollIntervalMs: 100 } }).instantTests.result(42, {}, { wait: true })).rejects.toMatchObject({ code: 'TIMEOUT', testId: 42 });
    await vi.advanceTimersByTimeAsync(50);
    await assertion;
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('aborts an in-flight request when the overall deadline expires', async () => {
    let signal: AbortSignal;
    vi.stubGlobal('fetch', vi.fn().mockImplementation((_url, init) => {
      signal = init.signal;
      return new Promise((_resolve, reject) => signal.addEventListener('abort', () => reject(signal.reason), { once: true }));
    }));
    const assertion = expect(client({ settings: { timeoutMs: 50 } }).instantTests.result(42, {}, { wait: true })).rejects.toMatchObject({ code: 'TIMEOUT', testId: 42 });
    await vi.advanceTimersByTimeAsync(50);
    await assertion;
    expect(signal!.aborted).toBe(true);
  });

  it.each([0, -1, NaN, Infinity, 1.5, 2_147_483_648])('rejects unsafe timer values before polling: %s', async (value) => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    for (const key of ['timeoutMs', 'pollIntervalMs'] as const) {
      await expect(client().instantTests.result(42, {}, { wait: true }, { [key]: value })).rejects.toBeInstanceOf(RangeError);
    }
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([0, 1])('propagates HTTP errors without retrying at stage %s', async (stage) => {
    const fetchMock = vi.fn();
    if (stage > 0) fetchMock.mockResolvedValueOnce(status(0));
    fetchMock.mockResolvedValueOnce(new Response('{}', { status: 503 }));
    vi.stubGlobal('fetch', fetchMock);
    await expect(client().instantTests.result(42, {}, { wait: true })).rejects.toBeInstanceOf(WebPageTestError);
    expect(fetchMock).toHaveBeenCalledTimes(stage + 1);
    expect(vi.getTimerCount()).toBe(0);
  });
});
