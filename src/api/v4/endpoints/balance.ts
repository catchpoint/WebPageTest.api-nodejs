import type { HttpClient } from '../../../core/http/client.js';

import { v4Contract } from '../contract.js';
import type { BalanceResponse } from '../types/balance.js';

export class BalanceEndpoint {
  constructor(private readonly http: HttpClient) {}

  get(): Promise<BalanceResponse> {
    return this.http.request<BalanceResponse>(v4Contract.endpoints.instantTests.balance);
  }
}
