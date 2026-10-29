import { WebPageTest } from "../dist/index.js";

import { readExampleConfig } from "./utils/environment.mjs";

const config = readExampleConfig();

const client = new WebPageTest(config);
const response = await client.nodes.list();
console.table(
  (response.data.nodes ?? []).map((n) => ({
    id: n.id,
    name: n.name,
    enabledForInstantTest: n.enabledForInstantTest,
    enabledForScheduledTest: n.enabledForScheduledTest,
  })),
);
