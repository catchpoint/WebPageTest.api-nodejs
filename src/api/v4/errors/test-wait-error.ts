import { WebPageTestError } from '../../../core/errors/errors.js';

import type { TestWaitErrorCode } from '../enums.js';

export type { TestWaitErrorCode } from '../enums.js';

export class TestWaitError extends WebPageTestError {
  constructor(
    public readonly code: TestWaitErrorCode,
    public readonly testId: number,
    message: string,
  ) {
    super(message);
    this.name = 'TestWaitError';
  }
}
