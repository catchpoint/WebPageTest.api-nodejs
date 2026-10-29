import type { ApiResponse, ResponseData } from './response.js';

export interface InstantTestStatusData extends ResponseData {
  statusTypeId?: number | undefined;
  queuePosition?: number | null | undefined;
}

export type InstantTestStatusResponse = ApiResponse<InstantTestStatusData>;
