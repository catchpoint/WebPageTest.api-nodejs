import { WebPageTest } from "../dist/index.js";

import { readExampleConfig } from "./utils/environment.mjs";

const config = readExampleConfig();

const client = new WebPageTest(config);

// Get these IDs from the DeviceType and ConnectionType sections printed by `npm run example:enumerations`.
const deviceTypeId = Number("<deviceTypeId>");
const connectionTypeId = Number("<connectionTypeId>");
const response = await client.instantTests.create({
  url: "https://example.com",
  deviceType: deviceTypeId,
  connectionType: connectionTypeId,
  runs: 1,
  firstViewOnly: true,
  performance: true,
});

console.log(`Created instant test: ${response.data.id}`);
