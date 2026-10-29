import { WebPageTest } from '../dist/index.js';

import { readExampleConfig } from './utils/environment.mjs';
import { readTestIdArgument } from './utils/test-id.mjs';

const config = readExampleConfig();
const testId = readTestIdArgument('example:status');
const client = new WebPageTest(config);
const response = await client.instantTests.status(testId);

console.table([{
  testId,
  statusTypeId: response.data.statusTypeId,
  queuePosition: response.data.queuePosition,
}]);
