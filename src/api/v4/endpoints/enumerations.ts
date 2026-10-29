import { withQuery } from '../../../core/http/query.js';
import type { HttpClient } from '../../../core/http/client.js';

import { v4Contract } from '../contract.js';
import type { EnumerationsQuery, EnumerationsResponse } from '../types/enumerations.js';

export class EnumerationsEndpoint {
  constructor(private readonly http: HttpClient) {}

  list(query: EnumerationsQuery = {}): Promise<EnumerationsResponse> {
    return this.http.request<EnumerationsResponse>(withQuery(v4Contract.endpoints.instantTests.enumerations, query));
  }
}
