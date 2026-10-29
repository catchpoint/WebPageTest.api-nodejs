import { afterEach, describe, expect, it, vi } from 'vitest';

import { readExampleConfig } from '../examples/utils/environment.mjs';

describe('example environment validation', () => {
  afterEach(() => vi.unstubAllEnvs());

  it.each([undefined, '', '   ', '\t\n'])('rejects a missing or blank API key: %j', (apiKey) => {
    expect(() => readExampleConfig({ WPT_API_KEY: apiKey })).toThrow('Set WPT_API_KEY');
  });

  it('allows the optional base URL to be omitted', () => {
    expect(readExampleConfig({ WPT_API_KEY: 'test-key' })).toEqual({ apiKey: 'test-key' });
  });

  it.each(['https://example.test', 'http://localhost:3000'])('accepts a configured URL: %s', (baseUrl) => {
    expect(readExampleConfig({ WPT_API_KEY: 'test-key', WPT_BASE_URL: baseUrl }))
      .toEqual({ apiKey: 'test-key', baseUrl });
  });

  it.each(['', '  ', 'invalid', '/relative', 'ftp://example.test'])('rejects an invalid configured URL: %j', (baseUrl) => {
    expect(() => readExampleConfig({ WPT_API_KEY: 'test-key', WPT_BASE_URL: baseUrl }))
      .toThrow('WPT_BASE_URL must be a valid HTTP or HTTPS URL when set.');
  });

  it('reads the current process environment on each call', () => {
    vi.stubEnv('WPT_API_KEY', 'test-key');
    vi.stubEnv('WPT_BASE_URL', undefined);
    expect(readExampleConfig()).toEqual({ apiKey: 'test-key' });
    vi.stubEnv('WPT_API_KEY', '');
    expect(() => readExampleConfig()).toThrow('Set WPT_API_KEY');
  });

  it('does not include environment values in validation errors', () => {
    const validate = () => readExampleConfig({
      WPT_API_KEY: 'test-secret',
      WPT_BASE_URL: 'invalid-test-secret',
    });
    expect(validate).toThrow('WPT_BASE_URL must be a valid HTTP or HTTPS URL when set.');
    expect(validate).not.toThrow('test-secret');
  });
});
