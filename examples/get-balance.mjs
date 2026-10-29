import { WebPageTest } from '../dist/index.js';

import { readExampleConfig } from './utils/environment.mjs';

const config = readExampleConfig();
const response = await new WebPageTest(config).balance.get();
console.log(`Remaining runs: ${response.data.balance ?? 'unavailable'}`);
