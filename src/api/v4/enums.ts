export enum InstantTestStatus {
  Completed = 0,
  Running = 1,
  /** The test was not executed within approximately two hours. */
  Timeout = 4,
}

export const TestWaitErrorCode = {
  Timeout: 'TIMEOUT',
  TestTimeout: 'TEST_TIMEOUT',
  UnknownStatus: 'UNKNOWN_STATUS',
} as const;

export type TestWaitErrorCode = typeof TestWaitErrorCode[keyof typeof TestWaitErrorCode];
