import type { UsageLimits } from './usage-limits.js';

export type ResponseData = {
  hasMore?: boolean | null | undefined;
  next?: string | null | undefined;
  previous?: string | null | undefined;
};

export interface ResponseMetadata {
  messages?: Array<unknown> | null | undefined;
  errors?: Array<unknown> | null | undefined;
  completed?: boolean | undefined;
  traceId?: string | null | undefined;
  usageLimits?: UsageLimits | undefined;
}

export interface ApiResponse<TData> extends ResponseMetadata {
  data: TData;
}
