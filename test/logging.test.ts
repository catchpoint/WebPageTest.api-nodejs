import { afterEach, describe, expect, it, vi } from 'vitest';

import { WebPageTest } from '../src/index.js';
import { createLogger } from '../src/core/logger.js';
import type { LogLevel } from '../src/index.js';

const makeLogger = () => ({ debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() });
afterEach(() => { vi.unstubAllGlobals(); vi.restoreAllMocks(); });

describe('application logging', () => {
  it.each([
    ['silent', []],
    ['error', ['error']],
    ['warn', ['error', 'warn']],
    ['info', ['error', 'warn', 'info']],
    ['debug', ['error', 'warn', 'info', 'debug']],
  ] as const)('filters messages at level %s before invoking the destination', (level, expected) => {
    const destination = makeLogger();
    const logger = createLogger({ level, logger: destination });
    for (const severity of ['error', 'warn', 'info', 'debug'] as const) {
      logger[severity]('message');
      expect(destination[severity]).toHaveBeenCalledTimes((expected as readonly string[]).includes(severity) ? 1 : 0);
    }
  });

  it('defaults to silent even when a custom logger is supplied', () => {
    const destination = makeLogger();
    createLogger({ logger: destination }).error('message');
    expect(destination.error).not.toHaveBeenCalled();
  });

  it('uses console when only a level is configured', async () => {
    const debug = vi.spyOn(console, 'debug').mockImplementation(() => {});
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{"data":{}}')));
    await new WebPageTest({ apiKey: 'key', logging: { level: 'debug' } }).enumerations.list();
    expect(debug).toHaveBeenCalledTimes(2);
  });

  it('logs response receipt once for JSON and byte requests', async () => {
    const logger = makeLogger();
    vi.stubGlobal('fetch', vi.fn().mockImplementation(async () => new Response('{"data":{}}')));
    const client = new WebPageTest({ apiKey: 'key', logging: { level: 'debug', logger } });

    await client.nodes.list();
    await client.instantTests.downloadArtifact(1, 2);

    const messages = logger.debug.mock.calls.map(([message]) => message as string);
    expect(messages).toHaveLength(4);
    expect(messages.filter((message) => message.includes('WebPageTest API response received (HTTP 200).'))).toHaveLength(2);
  });

  it('rejects invalid levels before making requests', () => {
    expect(() => new WebPageTest({ apiKey: 'key', logging: { level: 'invalid' as LogLevel } }))
      .toThrow('logging.level must be');
  });

  it('shares the application logger across endpoints and preserves its method context', async () => {
    const messages: string[] = [];
    const logger = { ...makeLogger(), messages, debug(message: string) { this.messages.push(message); } };
    vi.stubGlobal('fetch', vi.fn().mockImplementation(async () => new Response('{"data":{}}')));
    const client = new WebPageTest({ apiKey: 'secret-key', logging: { level: 'debug', logger } });
    await client.history.list({ search: 'private-search' });
    await client.nodes.list();
    expect(messages).toHaveLength(4);
    expect(messages.join(' ')).not.toMatch(/secret-key|private-search/);
  });

  it('does not share configuration between clients or log to console by default', async () => {
    const logger = makeLogger();
    const consoleSpies = ['debug', 'info', 'warn', 'error', 'log'].map((method) =>
      vi.spyOn(console, method as 'debug').mockImplementation(() => {}));
    vi.stubGlobal('fetch', vi.fn().mockImplementation(async () => new Response('{"data":{}}')));
    const logged = new WebPageTest({ apiKey: 'key', logging: { level: 'debug', logger } });
    await new WebPageTest({ apiKey: 'key' }).nodes.list();
    expect(logger.debug).not.toHaveBeenCalled();
    expect(consoleSpies.every((spy) => spy.mock.calls.length === 0)).toBe(true);
    await logged.nodes.list();
    expect(logger.debug).toHaveBeenCalledTimes(2);
  });

  it.each(['http', 'network'])('logs %s failures without sensitive data or retries', async (failure) => {
    const logger = makeLogger();
    const fetchMock = failure === 'http'
      ? vi.fn().mockResolvedValue(new Response('{"secret":"private-payload"}', { status: 503 }))
      : vi.fn().mockRejectedValue(new Error('private-network-details'));
    vi.stubGlobal('fetch', fetchMock);
    await expect(new WebPageTest({ apiKey: 'secret-key', logging: { level: 'debug', logger } }).nodes.list()).rejects.toThrow();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(logger.error).toHaveBeenCalledTimes(1);
    expect(JSON.stringify(logger.error.mock.calls)).not.toMatch(/secret-key|private-/);
  });

  it('reports scheduling expiration through the shared logger', async () => {
    const logger = makeLogger();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{"data":{"statusTypeId":4}}')));
    await expect(new WebPageTest({ apiKey: 'key', logging: { level: 'debug', logger } }).instantTests.result(42, {}, { wait: true }))
      .rejects.toMatchObject({ code: 'TEST_TIMEOUT' });
    expect(logger.warn).toHaveBeenCalledWith(expect.stringMatching(/^\[\d{4}-\d{2}-\d{2}T[^\]]+Z\] Test 42 expired before execution \(server scheduling timeout\)\.$/));
  });

  it('adds an ISO timestamp to every emitted message', () => {
    const destination = makeLogger();
    createLogger({ level: 'info', logger: destination }).info('message');
    expect(destination.info).toHaveBeenCalledWith(expect.stringMatching(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\] message$/));
  });
});
