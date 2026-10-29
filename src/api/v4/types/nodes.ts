import type { Enumeration } from './enumeration.js';
import type { ApiResponse, ResponseData } from './response.js';

export type NodesQuery = {
  statusId?: number | undefined;
};

export type NodesResponse = ApiResponse<ResponseData & {
  nodes?: Array<{
    enabledForInstantTest?: boolean | undefined;
    enabledForScheduledTest?: boolean | undefined;
    id: number;
    changeDate: string;
    name?: string | null | undefined;
    networkType?: Enumeration | undefined;
    status?: Enumeration | undefined;
    internetServiceProvider?: Enumeration | undefined;
    country?: Enumeration | undefined;
    city?: Enumeration | undefined;
    region?: Enumeration | undefined;
    isPaused?: boolean | undefined;
  }> | null | undefined;
}>;
