import { withQuery } from "../../../core/http/query.js";
import type { HttpClient } from "../../../core/http/client.js";

import { v4Contract } from "../contract.js";
import type { NodesQuery, NodesResponse } from "../types/nodes.js";

export class NodesEndpoint {
  constructor(private readonly http: HttpClient) {}

  list(query: NodesQuery = {}): Promise<NodesResponse> {
    return this.http.request<NodesResponse>(withQuery(v4Contract.endpoints.instantTests.nodes, query));
  }
}
