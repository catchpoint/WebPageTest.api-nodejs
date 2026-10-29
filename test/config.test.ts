import { describe, expect, it } from 'vitest';
import { parseConfig } from '../src/core/config/config.js';

describe('configuration', () => {
  it.each(['ftp://example.test', 'file:///tmp/example', 'mailto:test@example.test'])('rejects non-HTTP URLs: %s', (baseUrl) => {
    expect(() => parseConfig({ apiKey: 'test-key', baseUrl })).toThrow(TypeError);
  });

  it.each([0, -1, NaN, Infinity, 1.5, 2_147_483_648])('rejects invalid global timers at construction: %s', (value) => {
    for (const key of ['pollIntervalMs', 'timeoutMs'] as const) {
      expect(() => parseConfig({ apiKey: 'test-key', settings: { [key]: value } })).toThrow(RangeError);
    }
  });
  it.each(['', '   ', undefined, null])('rejects missing or blank API keys: %j', (apiKey) => {
    expect(() => parseConfig({ apiKey: apiKey as string })).toThrow(TypeError);
  });

  it('rejects invalid base URLs without including their values in the error', () => {
    expect(() => parseConfig({ apiKey: 'test-key', baseUrl: 'invalid-value' })).toThrow('baseUrl must be a valid URL.');
  });

  it('applies secure defaults', () => {
    expect(parseConfig({ apiKey: 'test-key' })).toMatchObject({
      baseUrl: 'https://io.catchpoint.com',
      requestTimeoutMs: 30_000,
    });
  });

  it('accepts a custom API base URL', () => {
    expect(parseConfig({ apiKey: 'test-key', baseUrl: 'https://wpt.example.test' }).baseUrl).toBe('https://wpt.example.test');
  });

});
