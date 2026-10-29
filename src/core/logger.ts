/** Destination for client log messages. */
export interface Logger {
  debug(message: string): void;
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
}

const LOG_LEVELS = { silent: 0, error: 1, warn: 2, info: 3, debug: 4 } as const;
export type LogLevel = keyof typeof LOG_LEVELS;

export interface LoggingOptions {
  /** Minimum severity to print; defaults to silent. */
  level?: LogLevel;
  /** Custom destination; defaults to console. */
  logger?: Logger;
}

export function createLogger(options: LoggingOptions = {}): Logger {
  const level = options.level ?? 'silent';
  if (!Object.hasOwn(LOG_LEVELS, level)) {
    throw new TypeError('logging.level must be silent, error, warn, info, or debug.');
  }
  const destination = options.logger ?? console;
  const log = (severity: keyof Logger, message: string): void => {
    if (LOG_LEVELS[severity] <= LOG_LEVELS[level]) {
      destination[severity](`[${new Date().toISOString()}] ${message}`);
    }
  };
  return {
    debug: (message) => log('debug', message),
    info: (message) => log('info', message),
    warn: (message) => log('warn', message),
    error: (message) => log('error', message),
  };
}
