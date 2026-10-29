import { writeFile } from 'node:fs/promises';

import { WebPageTest } from '../dist/index.js';

import { readExampleConfig } from './utils/environment.mjs';
import { readTestIdArgument } from './utils/test-id.mjs';

const config = readExampleConfig();
const testId = readTestIdArgument('example:artifact');
// Get this ID from the WptTestArtifactType section printed by `npm run example:enumerations`.
const artifactTypeArgument = process.argv[3];
if (!artifactTypeArgument || !/^\d+$/.test(artifactTypeArgument)) {
  throw new Error('Pass an artifact type ID from enumerations: npm run example:artifact -- <testId> <artifactTypeId> [outputFile]');
}
const artifactType = Number(artifactTypeArgument);
if (!Number.isSafeInteger(artifactType)) {
  throw new Error('The artifact type ID must be a non-negative safe integer.');
}

const outputFile = process.argv[4] ?? 'wpt-artifact.bin';
if (!outputFile.trim()) {
  throw new Error('The output file path must not be blank.');
}

const client = new WebPageTest(config);
const artifact = await client.instantTests.downloadArtifact(testId, artifactType, {
  run: 1,
  cached: false,
  step: 1,
});
await writeFile(outputFile, artifact.data);
console.log(`Saved ${artifact.data.byteLength} bytes to ${outputFile} (${artifact.contentType ?? 'unknown content type'}).`);
