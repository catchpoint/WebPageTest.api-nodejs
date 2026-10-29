import { parseConfig } from '../../core/config/config.js';
import { HttpClient } from '../../core/http/client.js';

import type { WebPageTestClientConfig } from '../../core/config/config.js';

import { v4Contract } from './contract.js';
import { BalanceEndpoint } from './endpoints/balance.js';
import { EnumerationsEndpoint } from './endpoints/enumerations.js';
import { HistoryEndpoint } from './endpoints/history.js';
import { InstantTestEndpoint } from './endpoints/instant-test.js';
import { NodesEndpoint } from './endpoints/nodes.js';

export class V4WebPageTestClient {
  public readonly balance: BalanceEndpoint;
  public readonly instantTests: InstantTestEndpoint;
  public readonly nodes: NodesEndpoint;
  public readonly enumerations: EnumerationsEndpoint;
  public readonly history: HistoryEndpoint;

  constructor(config: WebPageTestClientConfig) {
    const parsedConfig = parseConfig(config);
    const http = new HttpClient(parsedConfig, v4Contract.basePath);

    this.balance = new BalanceEndpoint(http);
    this.instantTests = new InstantTestEndpoint(http, parsedConfig.logger, parsedConfig.settings);
    this.nodes = new NodesEndpoint(http);
    this.enumerations = new EnumerationsEndpoint(http);
    this.history = new HistoryEndpoint(http);
  }
}
