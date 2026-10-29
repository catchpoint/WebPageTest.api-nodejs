import { WebPageTest } from '../src/index.js';
import type { EnumerationsQuery, HistoryResponse, InstantTestCreateRequest, InstantTestResultResponse, NodesResponse, ResultEnumeration, StaticArtifactDownload, StaticArtifactQuery } from '../src/index.js';

const enumeration: ResultEnumeration = { id: 1, name: 'Example' };
const request: InstantTestCreateRequest = { url: 'https://example.com', deviceType: 22, labels: [{ name: 'Example', changeLogObjectType: enumeration }] };
const result: InstantTestResultResponse = {
  data: { createDate: '2026-10-02T12:30:35.347', runs: [{ viewType: enumeration, requests: [{ status: enumeration, contentType: enumeration }], pageEvents: [{ metricType: enumeration }] }], medians: [{ type: enumeration }] },
  usageLimits: { configCallLimit: { day: 1 } },
};
const nodes: NodesResponse = { data: { nodes: [{ id: 1, changeDate: '2026-10-02T12:30:35.347', networkType: enumeration }] } };
const history: HistoryResponse = { data: { webpageTestHistory: [{ runTime: '2026-10-02T12:30:35.347', labels: null }], next: null } };
const query: EnumerationsQuery = { includeDeviceType: true, includeConnectionType: undefined };

// @ts-expect-error Enum values are objects, not numeric IDs.
const numericEnum: ResultEnumeration = 1;
// @ts-expect-error Creation requires a numeric device ID.
const invalidRequest: InstantTestCreateRequest = { url: 'https://example.com', deviceType: '22' };
// @ts-expect-error Enumeration query options must be booleans.
const invalidQuery: EnumerationsQuery = { includeDeviceType: 'true' };
// @ts-expect-error Unknown enumeration filters are not part of the public API.
const unknownQuery: EnumerationsQuery = { unknown: true };
// @ts-expect-error Creation label enum values are objects.
const invalidLabel: InstantTestCreateRequest = { url: 'https://example.com', deviceType: 22, labels: [{ name: 'Example', changeLogObjectType: 1 }] };

void [request, result, nodes, history, query, numericEnum, invalidRequest, invalidQuery, unknownQuery, invalidLabel];

const status: import('../src/index.js').InstantTestStatusResponse = { data: { statusTypeId: 1, queuePosition: null } };
// @ts-expect-error Status identifiers are numeric fields, not enum objects.
const invalidStatus: import('../src/index.js').InstantTestStatusData = { statusTypeId: { id: 1, name: 'Example' } };
void [status, invalidStatus];

// @ts-expect-error Caller-provided cancellation is not part of result options.
const invalidResultOptions: import('../src/index.js').InstantTestResultOptions = { signal: AbortSignal.abort() };
void invalidResultOptions;

const artifactQuery: StaticArtifactQuery = { run: 1, cached: false, step: 0 };
const artifactDownload: StaticArtifactDownload = { data: new Uint8Array([0, 255]), contentType: 'application/octet-stream' };
// @ts-expect-error Artifact type IDs are numeric.
void new WebPageTest({ apiKey: 'test-key' }).instantTests.downloadArtifact(1, 'Har');
// @ts-expect-error Cached is a boolean query parameter.
const invalidArtifactQuery: StaticArtifactQuery = { cached: 'false' };
void [artifactQuery, artifactDownload, invalidArtifactQuery];

const screenshot: import('../src/index.js').InstantTestScreenshotResponse = {
  data: { screenshot: { image: 'AAEC', format: null } },
};
// @ts-expect-error Screenshot images are base64 strings.
const invalidScreenshot: import('../src/index.js').InstantTestScreenshot = { image: new Uint8Array() };
const responseBodyQuery: import('../src/index.js').ResponseBodyQuery = { run: 1, cached: false, step: 0 };
const responseBody: import('../src/index.js').ResponseBodyDownload = { data: new Uint8Array(), contentType: 'text/html' };
// @ts-expect-error A request ID is required to download a response body.
void new WebPageTest({ apiKey: 'test-key' }).instantTests.downloadResponseBody(1);
// @ts-expect-error Cached is a boolean query parameter.
const invalidResponseBodyQuery: import('../src/index.js').ResponseBodyQuery = { cached: 'false' };
void [screenshot, invalidScreenshot, responseBodyQuery, responseBody, invalidResponseBodyQuery];

const balance: import('../src/index.js').BalanceResponse = { data: { balance: 0 } };
const nullableBalance: import('../src/index.js').BalanceData = { balance: null };
// @ts-expect-error The remaining run balance is numeric.
const invalidBalance: import('../src/index.js').BalanceData = { balance: '42' };
void [balance, nullableBalance, invalidBalance];
