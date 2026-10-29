import type { ApiResponse, ResponseData } from './response.js';

export interface BalanceData extends ResponseData {
  balance?: number | null | undefined;
}

export type BalanceResponse = ApiResponse<BalanceData>;
