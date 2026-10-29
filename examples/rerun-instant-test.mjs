import { WebPageTest } from "../dist/index.js";

import { readExampleConfig } from "./utils/environment.mjs";
import { readTestIdArgument } from "./utils/test-id.mjs";

const config = readExampleConfig();

const testId = readTestIdArgument('example:rerun');

const client = new WebPageTest(config);
const response = await client.instantTests.rerun(testId);

console.log(`Created instant test: ${response.data.id}`);
