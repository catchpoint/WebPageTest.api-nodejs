import { createLogger } from '../logger.js';
import type { Logger, LoggingOptions } from '../logger.js';

import { DEFAULT_POLL_INTERVAL_MS, DEFAULT_REQUEST_TIMEOUT_MS, DEFAULT_WAIT_TIMEOUT_MS, MAX_TIMER_MS } from './defaults.js';

const DEFAULT_BASE_URL = 'https://io.catchpoint.com';

export interface WebPageTestClientConfig {
  apiKey: string;
  baseUrl?: string;
  logging?: LoggingOptions;
  settings?: Settings;
}

export interface Settings {
  pollIntervalMs?: number;
  timeoutMs?: number;
}

export interface InternalWebPageTestConfig {
  apiKey: string;
  baseUrl: string;
  requestTimeoutMs: number;
  logger: Logger;
  settings: Required<Settings>;
}

export function validateSettings(settings: Settings): void {
  for (const [name, value] of Object.entries(settings)) {
    if (!Number.isInteger(value) || value <= 0 || value > MAX_TIMER_MS) {
      throw new RangeError(`${name} must be a positive integer no greater than ${MAX_TIMER_MS}.`);
    }
  }
}

export function parseConfig(input: WebPageTestClientConfig): InternalWebPageTestConfig {
  if (typeof input?.apiKey !== 'string' || !input.apiKey.trim()) {
    throw new TypeError('apiKey must be a non-empty string.');
  }
  const baseUrl = input.baseUrl ?? DEFAULT_BASE_URL;
  try {
    const url = new URL(baseUrl);
    if (url.protocol !== 'https:' && url.protocol !== 'http:') throw new TypeError();
  } catch {
    throw new TypeError('baseUrl must be a valid URL.');
  }

  const settings = {
    pollIntervalMs: input.settings?.pollIntervalMs ?? DEFAULT_POLL_INTERVAL_MS,
    timeoutMs: input.settings?.timeoutMs ?? DEFAULT_WAIT_TIMEOUT_MS,
  };
  validateSettings(settings);
  return {
    apiKey: input.apiKey,
    baseUrl,
    requestTimeoutMs: DEFAULT_REQUEST_TIMEOUT_MS,
    logger: createLogger(input.logging),
    settings,
  };
}
