import { WebPageTest } from "../dist/index.js";

import { readExampleConfig } from "./utils/environment.mjs";

const client = new WebPageTest({ ...readExampleConfig(), logging: { level: 'info' }, settings: { pollIntervalMs: 60_000, timeoutMs: 600_000 } });
// Get these IDs from the DeviceType and ConnectionType sections printed by `npm run example:enumerations`.
const deviceTypeId = Number("<deviceTypeId>");
const connectionTypeId = Number("<connectionTypeId>");
const testRequest = {
  url: "https://example.com",
  deviceType: deviceTypeId,
  connectionType: connectionTypeId,
  runs: 1,
  firstViewOnly: true,
  performance: true,
};

const resultQuery = { includeWaterfall: false, includeFilmstrip: false, includeLighthouse: false };

const resultOptions = {
  wait: true,
};

const created = await client.instantTests.create(testRequest);
console.log("Created test:", created.data.id);
const result = await client.instantTests.result(created.data.id, resultQuery, resultOptions);

console.log("Completed test:", result.data.id);
console.table(
  (result.data.runs ?? []).map((run) => ({
    run: run.run,
    timeToFirstByte: run.timeToFirstByte,
    largestContentfulPaint: run.largestContentfulPaint,
  })),
);
