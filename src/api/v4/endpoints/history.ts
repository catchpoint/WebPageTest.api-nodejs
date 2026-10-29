import { withQuery } from '../../../core/http/query.js';
import type { HttpClient } from '../../../core/http/client.js';

import { v4Contract } from '../contract.js';
import type { HistoryQuery, HistoryResponse } from '../types/history.js';

export class HistoryEndpoint {
  constructor(private readonly http: HttpClient) {}

  list(query: HistoryQuery = {}): Promise<HistoryResponse> {
    return this.http.request<HistoryResponse>(withQuery(v4Contract.endpoints.instantTests.history, query));
  }
}
