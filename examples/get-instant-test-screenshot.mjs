import { WebPageTest } from '../dist/index.js';

import { readExampleConfig } from './utils/environment.mjs';
import { readTestIdArgument } from './utils/test-id.mjs';

const config = readExampleConfig();
const testId = readTestIdArgument('example:screenshot');
const response = await new WebPageTest(config).instantTests.screenshot(testId);
const screenshot = response.data.screenshot;

if (!screenshot) {
  console.log('No screenshot was returned.');
} else {
  console.log(`Screenshot format: ${screenshot.format ?? 'unknown'}`);
  console.log(`Base64 characters: ${screenshot.image.length}`);
}
