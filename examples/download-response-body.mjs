import { writeFile } from 'node:fs/promises';

import { WebPageTest } from '../dist/index.js';

import { readExampleConfig } from './utils/environment.mjs';
import { readTestIdArgument } from './utils/test-id.mjs';

const config = readExampleConfig();
const testId = readTestIdArgument('example:response-body');
const requestId = process.argv[3]?.trim();
if (!requestId) {
  throw new Error('Pass a request ID from the test waterfall: npm run example:response-body -- <testId> <requestId> [outputFile]');
}

const outputFile = process.argv[4] ?? 'wpt-response-body.bin';
if (!outputFile.trim()) {
  throw new Error('The output file path must not be blank.');
}

const body = await new WebPageTest(config).instantTests.downloadResponseBody(testId, requestId, {
  run: 1,
  cached: false,
  step: 1,
});
await writeFile(outputFile, body.data);
console.log(`Saved ${body.data.byteLength} bytes to ${outputFile} (${body.contentType ?? 'unknown content type'}).`);
