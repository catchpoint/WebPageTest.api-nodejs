import type { ApiResponse, ResponseData } from './response.js';

export type HistoryQuery = {
  divisionId?: number | undefined;
  search?: string | undefined;
  startTimeUtc?: string | undefined;
  endTimeUtc?: string | undefined;
  pageNumber?: number | undefined;
  pageSize?: number | undefined;
};

export type HistoryRecord = {
  parentId?: number | null | undefined;
  controlRunId?: number | null | undefined;
  appliedExperiments?: Array<{
    id?: number | undefined;
    name?: string | null | undefined;
  }> | null | undefined;
  id?: number | undefined;
  status?: {
    id?: number | undefined;
    name?: string | null | undefined;
  } | undefined;
  url?: string | null | undefined;
  node?: {
    id?: number | undefined;
    name?: string | null | undefined;
  } | undefined;
  types?: Array<string> | null | undefined;
  runTime?: string | undefined;
  runs?: number | undefined;
  labels?: Array<{
    color?: string | null | undefined;
    id?: number | null | undefined;
    name?: string | null | undefined;
    values?: Array<string> | null | undefined;
  }> | null | undefined;
};

export type HistoryResponse = ApiResponse<ResponseData & {
  webpageTestHistory?: Array<HistoryRecord> | null | undefined;
}>;
