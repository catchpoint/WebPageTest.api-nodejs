export class WebPageTestError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly traceId?: string,
    public override readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'WebPageTestError';
  }
}
