# WebPageTest Node.js Client

TypeScript client for the Catchpoint WebPageTest REST API v4, with ESM exports, native `fetch`, and TypeScript request/response types.

## Requirements

- Node.js **20.11.0 or newer** and npm.
- A Catchpoint WebPageTest REST API key to call the API.
- An ESM application: use `.mjs` files or set `"type": "module"` in your application's `package.json`.

## Quick start

Install the package in your application and set `WPT_API_KEY` in the environment. The client uses the native `fetch` available in supported Node.js versions.

```sh
npm install webpagetest-node
```

```js
import { WebPageTest } from 'webpagetest-node';

const client = new WebPageTest({ apiKey: process.env.WPT_API_KEY });
console.log('Client ready:', Boolean(client));
```

For credential setup and complete runnable examples, see [Set up the repository](#set-up-the-repository). For detailed client usage, see [Use the client in your application](#use-the-client-in-your-application).

## Available features

### Utilities

| Feature | Method | Description |
| --- | --- | --- |
| Browse test history | `client.history.list(query?)` | Retrieve test history, filter by search text or date range, and request a specific page. |
| Check remaining runs | `client.balance.get()` | Retrieve the remaining run balance for a Pro API account. |
| Retrieve enumerations | `client.enumerations.list(query?)` | Obtain the numeric IDs to use when creating a test, including device types, connection types, and screen resolutions. |
| List test locations | `client.nodes.list(query?)` | Retrieve available nodes, optionally filter by status, and identify locations enabled for instant tests. |

### Instant tests

| Feature | Method | Description |
| --- | --- | --- |
| Create instant tests | `client.instantTests.create(request)` | Submit a URL with IDs selected from enumerations and test locations, configure runs and optional advanced settings, and receive the created test identifier. |
| Rerun instant tests | `client.instantTests.rerun(testId)` | Rerun an existing instant test and receive the new test identifier. |
| Check instant test status | `client.instantTests.status(testId)` | Retrieve the current status identifier and queue position. |
| Retrieve instant test results | `client.instantTests.result(testId, query?, resultOptions?, settings?)` | Retrieve run metrics, optionally waiting for completion and including waterfall, filmstrip, and Lighthouse data. |
| Retrieve a screenshot | `client.instantTests.screenshot(testId)` | Retrieve the first available screenshot as a base64 image with its format. |
| Download a response body | `client.instantTests.downloadResponseBody(testId, requestId, query?)` | Download the raw body and content type for a request in the test waterfall. |
| Download a static artifact | `client.instantTests.downloadArtifact(testId, artifactType, query?)` | Download raw artifact bytes and the response content type for an existing test. |

## Set up the repository

From the repository root, install the locked dependencies and build the package:

```sh
npm ci
npm run build
```

The build clears `dist/` before writing JavaScript and TypeScript declarations, so removed or renamed modules do not remain in the output. The included examples import this local build, so you can try the client directly from the repository.

### Configure credentials

Set `WPT_API_KEY` in the terminal where you will run the examples, or inject it through your secrets manager. Keep API keys out of source control.

All examples use a shared environment check and stop before making API calls if `WPT_API_KEY` is missing, empty, or contains only whitespace. Error messages identify the variable without printing its value. The scripts read the current process environment; they do not automatically load a `.env` file.

PowerShell:

```powershell
$env:WPT_API_KEY = 'replace-with-your-api-key'
```

Bash / zsh:

```sh
export WPT_API_KEY='replace-with-your-api-key'
```

### Run the examples

#### Utilities

Browse the first page of test history, optionally passing search text after `--`:

```sh
npm run example:history
npm run example:history -- "example.com"
```

The history example displays test identifiers, statuses, run times, and run counts. Edit `pageNumber` and `pageSize` in [list-history.mjs](examples/list-history.mjs) to browse the history; `pageNumber` is a zero-based index, so the first page is index `0`. Add `startTimeUtc` or `endTimeUtc` to the query when needed.

Check the remaining run balance for a Pro API account:

```sh
npm run example:balance
```

The balance example prints the remaining run count, or `unavailable` when the response has no balance value. It makes one request and does not create a test.

Retrieve the enumeration IDs needed to configure a new test:

```sh
npm run example:enumerations
```

Use the returned IDs for fields such as `deviceType`, `connectionType`, and `deviceResolution` when creating a test.

Find available test locations and choose a node ID for test creation:

```sh
npm run example:nodes
```

#### Instant tests

Then edit [`examples/create-instant-test.mjs`](examples/create-instant-test.mjs) to set your target URL and compatible identifiers from those responses. Get the IDs by running [`example:enumerations`](#retrieve-enumerations) and use entries from the `DeviceType` and `ConnectionType` sections for `<deviceTypeId>` and `<connectionTypeId>`. If you specify a `nodeId`, select a node with `enabledForInstantTest: true` from [`example:nodes`](#run-the-examples).

Run the creation example when ready to start a real test:

```sh
npm run example:instant-test
```

To create a real test and wait for its results:

```sh
npm run example:create-and-wait
```

Edit the URL and configuration in [create-and-wait.mjs](examples/create-and-wait.mjs). It creates a test, prints its identifier immediately, then waits for results and prints selected run metrics.

To rerun a test, pass its identifier from creation or history. Replace `12345` with an existing test ID:

```sh
npm run example:rerun -- 12345
```

The rerun example starts a new test and prints its new identifier. It requires an explicit positive integer ID and stops before calling the service if the argument is missing or invalid.

Check the current status of an existing test ID:

```sh
npm run example:status -- 12345
```

The status example requires a positive integer test ID and prints its status identifier and queue position. It makes one request without creating a test or polling.

Retrieve results for an existing test ID:

```sh
npm run example:result -- 12345
```

The result example prints a table of run metrics and does not create a test. Edit its query options to select a run or request additional details. It makes one request without polling for completion.

Retrieve the first available screenshot for an existing test:

```sh
npm run example:screenshot -- 12345
```

The screenshot example prints the image format and base64 character count. It makes one request and does not create a test.

Download the body of a request from the test waterfall. Replace `request-123` with a request ID from results retrieved with waterfall details:

```sh
npm run example:response-body -- 12345 request-123 wpt-response-body.bin
```

The response-body example saves raw bytes to a file and prints the byte count and content type. It makes one request and does not create a test. Edit the run, cached-view, and step values in [download-response-body.mjs](examples/download-response-body.mjs) as needed. Response bodies may contain sensitive data.

Download a static artifact for an existing test. Run [`example:enumerations`](#retrieve-enumerations), which requests `WptTestArtifactType`, and replace `<artifactTypeId>` with an ID from that section:

```sh
npm run example:artifact -- 12345 <artifactTypeId> wpt-artifact.bin
```

The artifact example saves the raw response to the specified file and prints its byte count and content type. It makes one request and does not create a test. Edit the run, cached-view, and step values in [download-static-artifact.mjs](examples/download-static-artifact.mjs) as needed.

#### Example scripts

| Scope | Script | Source | Output |
| --- | --- | --- | --- |
| Utilities | `example:history` | [list-history.mjs](examples/list-history.mjs) | A page of test history and an indication of more available records. |
| Utilities | `example:balance` | [get-balance.mjs](examples/get-balance.mjs) | Remaining run balance for a Pro API account. |
| Utilities | `example:enumerations` | [list-enumerations.mjs](examples/list-enumerations.mjs) | Enumeration sections and their values. |
| Utilities | `example:nodes` | [list-nodes.mjs](examples/list-nodes.mjs) | Available nodes. |
| Instant tests | `example:instant-test` | [create-instant-test.mjs](examples/create-instant-test.mjs) | The created test identifier. |
| Instant tests | `example:create-and-wait` | [create-and-wait.mjs](examples/create-and-wait.mjs) | Creates a real test and waits for its final run metrics. |
| Instant tests | `example:rerun` | [rerun-instant-test.mjs](examples/rerun-instant-test.mjs) | The new identifier of the rerun test. |
| Instant tests | `example:status` | [get-instant-test-status.mjs](examples/get-instant-test-status.mjs) | Current status identifier and queue position. |
| Instant tests | `example:result` | [get-instant-test-result.mjs](examples/get-instant-test-result.mjs) | Run metrics for an existing instant test. |
| Instant tests | `example:screenshot` | [get-instant-test-screenshot.mjs](examples/get-instant-test-screenshot.mjs) | Screenshot format and base64 character count. |
| Instant tests | `example:response-body` | [download-response-body.mjs](examples/download-response-body.mjs) | Raw response-body bytes saved to a file, with byte count and content type printed. |
| Instant tests | `example:artifact` | [download-static-artifact.mjs](examples/download-static-artifact.mjs) | Raw artifact bytes saved to a file, with byte count and content type printed. |

Each script rebuilds `dist/` before running. The examples make live API calls; the automated tests do not require an API key.

## Use the client in your application

To install from a local checkout, build it first as shown above, then run this command from your application's directory, replacing the path with the checkout location:

```sh
npm install /path/to/webpagetest-node
```

The following examples use the installed package. For a script saved in the repository root, use `import { WebPageTest } from './dist/index.js'` instead.

### Create a client

```js
import { WebPageTest } from 'webpagetest-node';

const apiKey = process.env.WPT_API_KEY;
if (!apiKey?.trim()) {
  throw new Error('Set WPT_API_KEY before running this script.');
}

const client = new WebPageTest({ apiKey });
```

Save this setup and any of the snippets below in an `.mjs` file and run it with `node your-script.mjs`. TypeScript applications can use the same API with the included type declarations.

### Application logging

Configure logging once for all client operations, including utility requests and instant-test polling. To print progress to the console, specify only a level:

```js
const client = new WebPageTest({ apiKey, logging: { level: 'info' } });
```

`logging.level` accepts `silent` (default), `error`, `warn`, `info`, and `debug`. Each level includes more severe messages: `info` prints info, warnings, and errors. `silent` disables all logging, even with a custom logger.

For a custom destination, pass `logging: { level: 'info', logger: customLogger }`. The logger must provide `debug`, `info`, `warn`, and `error` methods accepting a message string; an existing Winston logger can be used directly. The client filters messages before forwarding them; the custom logger may apply additional filtering. Configure formatting and destinations on your custom logger. No logging dependency is required. Public types are `LoggingOptions`, `LogLevel`, and `Logger`.

The shared logger receives request lifecycle messages at `debug`, waiting progress at `info`, server scheduling expiration at `warn`, and HTTP/network failures at `error`. Every emitted message is prefixed with an ISO 8601 UTC timestamp, for example `[2026-10-06T12:30:35.347Z] Checking status of test 42...`. Logs omit URLs, headers, credentials, and request/response payloads. Logger methods run synchronously and should not throw; exceptions propagate to the caller. Each client retains its own logging configuration.

### Utilities

#### Browse test history

Call `client.history.list()` without arguments to use the service's default filters and pagination. To narrow the results:

```js
const history = await client.history.list({
  search: 'example.com',
  startTimeUtc: '2026-10-01T00:00:00Z',
  endTimeUtc: '2026-10-02T00:00:00Z',
  pageNumber: 0,
  pageSize: 20,
});

for (const test of history.data.webpageTestHistory ?? []) {
  console.log(test.id, test.url, test.runTime, test.status?.name);
}
```

All filters are optional. Date filters accept ISO 8601 timestamps with `Z` or a timezone offset. History records may include node details, run counts, labels, parent/control identifiers, and applied experiments.

History `runTime` values can include or omit a timezone, for example `2026-10-01T21:34:41.553`. The client preserves the returned string without assigning a timezone or converting it to a `Date`.

Pagination metadata is available through `history.data.hasMore`, `next`, and `previous`. `pageNumber` is the zero-based page index (the first page is `0`); increment it to request the next page. The client returns one page per call.

#### Retrieve enumerations

Enumerations provide the numeric IDs accepted by test creation. Request the categories you need, choose compatible entries from the response, and pass their `id` values to `client.instantTests.create()`:

```js
const response = await client.enumerations.list({
  includeDeviceType: true,
  includeConnectionType: true,
  includeDeviceResolution: true,
});

for (const section of response.data.sections ?? []) {
  console.log(section.section, section.enumeration ?? []);
}
```

| Enumeration query option | Field in the creation request |
| --- | --- |
| `includeDeviceType` | `deviceType` |
| `includeConnectionType` | `connectionType` |
| `includeDeviceResolution` | `deviceResolution` |

Use the selected entry's numeric `id`, rather than its display name. Location IDs come from `client.nodes.list()` and are passed as `nodeId`.

Other available categories include authentication methods and browser types. Set `includeWptTestArtifactType: true` to request WebPageTest artifact types.

#### Find a test location

```js
const response = await client.nodes.list();
const instantTestNodes = (response.data.nodes ?? []).filter(
  (node) => node.enabledForInstantTest === true,
);

for (const node of instantTestNodes) {
  console.log(node.id, node.name);
}
```

Call `client.nodes.list({ statusId })` to filter by a known status identifier. Omitting the filter requests all available nodes.

### Instant tests

Before creating a test, use the enumerations utility to retrieve configuration IDs and the locations utility to select a node if needed.

#### Create an instant test

The minimum payload requires `url` and `deviceType`. First run [`example:enumerations`](#retrieve-enumerations) and select compatible IDs from the `DeviceType` and `ConnectionType` sections. Use those IDs for the placeholders below:

```js
const deviceTypeId = Number('<deviceTypeId>');
const connectionTypeId = Number('<connectionTypeId>');
const response = await client.instantTests.create({
  url: 'https://example.com',
  deviceType: deviceTypeId,
  connectionType: connectionTypeId,
  runs: 1,
  firstViewOnly: true,
  performance: true,
});

console.log(`Created instant test: ${response.data.id}`);
```

Replace the placeholders with compatible IDs from the corresponding enumeration sections. You can also pass a `nodeId` selected from the available instant-test locations. `runs` accepts integers from 1 to 6. Optional settings include connection type, device resolution, authentication, scripts, and advanced browser settings; see [the request type](src/api/v4/types/instant-test.ts) for the complete shape.

Creation returns a test identifier, not the test results.

#### Create a test and wait for results

As above, retrieve a `deviceType` ID from [`example:enumerations`](#retrieve-enumerations) before creating the test. Then pass its ID to `result` with `wait: true`. You can also wait for an existing test from history or a rerun:

```js
const testRequest = {
  url: 'https://example.com',
  deviceType: Number('<deviceTypeId>'),
  runs: 1,
};

const resultQuery = { includeWaterfall: true };
const resultOptions = {
  wait: true,
};

const created = await client.instantTests.create(testRequest);
console.log('Created test:', created.data.id);
const result = await client.instantTests.result(created.data.id, resultQuery, resultOptions);
console.log(result.data.id);
```

With `wait: true`, `result` checks status immediately and then polls sequentially. Status `1` means running, `0` means completed, and `4` means the test was not executed within approximately two hours. It retrieves results once after completion. Missing or unknown status IDs stop the operation with an error; shared `completed` metadata does not determine test completion. Waiting never creates a test. If it times out, call `result` again with the same ID to resume waiting.

| Option | Default | Purpose |
| --- | --- | --- |
| `wait` | `false` | Poll status before retrieving results. When false or omitted, fetch results once. |

Configure `settings: { pollIntervalMs, timeoutMs }` on the client for global result defaults. A single call can override those settings with a fourth `settings` argument: `result(testId, query, { wait: true }, { timeoutMs: 120_000 })`. The third argument is `resultOptions` and controls whether to wait. To see progress, configure the application logger as shown above.

| Setting | Default | Scope |
| --- | --- | --- |
| `pollIntervalMs` | `60_000` (1 minute) | Delay between sequential status checks when waiting. |
| `timeoutMs` | `600_000` (10 minutes) | Total waiting deadline, including status checks and final result retrieval. |

Global settings are validated when the client is created. Per-call overrides are validated before waiting and do not change the client's defaults. Timer values must be positive integers up to `2_147_483_647` milliseconds. With `wait: false`, the per-call timer settings are ignored. These settings do not change the separate 30-second HTTP request timeout. HTTP, network, and individual request timeout errors are returned immediately without retrying.

`TestWaitError` extends `WebPageTestError` and exposes `code` and `testId`. Import `TestWaitErrorCode` to compare codes using named constants, for example `error.code === TestWaitErrorCode.Timeout`. Codes are `TIMEOUT` for the waiting deadline, `TEST_TIMEOUT` for status 4 (the server scheduling window expired), and `UNKNOWN_STATUS` for an unrecognized status. A waiting deadline stops local polling and any request in progress; it does not cancel the remote test.

#### Rerun an instant test

Pass an existing instant test identifier, such as the one returned by creation or history:

```js
const rerunResponse = await client.instantTests.rerun(response.data.id);
console.log('Created rerun:', rerunResponse.data.id);
```

Each call starts a new test. The client does not retry a failed rerun automatically.

#### Check instant test status

`client.instantTests.status(testId)` returns the current `statusTypeId` and `queuePosition` without polling. `statusTypeId` is a numeric identifier. Import `InstantTestStatus` to compare it with `InstantTestStatus.Completed` (0), `InstantTestStatus.Running` (1), or `InstantTestStatus.Timeout` (4). Timeout means the test was not executed within approximately two hours; it is separate from the client waiting deadline. `queuePosition` is an integer or `null`; both fields may be omitted. Do not infer test completion from the shared response metadata field `completed`.

#### Retrieve instant test results

Pass a test ID returned by creation, rerun, or history to `client.instantTests.result(testId, query?)`. The query options are optional:

```js
const result = await client.instantTests.result(response.data.id, {
  run: 1,
  includeWaterfall: true,
  includeFilmstrip: false,
  includeLighthouse: true,
});

for (const run of result.data.runs ?? []) {
  console.log(run.run, run.timeToFirstByte, run.largestContentfulPaint);
}
```

All query options are optional. Omit the second argument to use the service defaults.

| Option | Purpose |
| --- | --- |
| `run` | Select a run by its numeric identifier. |
| `includeWaterfall` | Request waterfall details in each run's `requests` array. |
| `includeFilmstrip` | Request filmstrip frames in each run's `videoFrames` array, including base64 image data. |
| `includeLighthouse` | Request Lighthouse data in `result.data.lighthouse`. |

Results can include test metadata, run metrics, custom metrics, and CrUX data. Optional fields and collections may be absent or null. The client preserves timestamp strings, including those without a timezone.

Result enumerations (`viewType`, page-event `metricType`, median `type`, and waterfall `contentType` / `status`) are objects with a numeric `id` and an optional, nullable `name`. Node `networkType` and creation label `changeLogObjectType` use the same object shape. 

By default this method makes one request. Pass `{ wait: true }` as the third argument to wait for completion, as shown in the previous section. An empty `runs` array alone does not establish the test status. Avoid logging entire results, which can contain authentication details, URLs, page content, and console messages.

#### Retrieve a screenshot

`client.instantTests.screenshot(testId)` returns the first available screenshot in `data.screenshot`. Its `image` is base64 text and `format` may be absent or null. The method makes one request and does not create or wait for a test.

```js
import { writeFile } from 'node:fs/promises';

const response = await client.instantTests.screenshot(testId);
if (response.data.screenshot) {
  await writeFile('wpt-screenshot.bin', Buffer.from(response.data.screenshot.image, 'base64'));
}
```

#### Download a request response body

Request IDs are in the `id` fields of run `requests` returned by `client.instantTests.result(testId, { includeWaterfall: true })`. The `requestId` argument is required. Optional `run`, `cached`, and `step` query values select the request instance; the service defaults to run 1, first view, and step 1.

```js
import { writeFile } from 'node:fs/promises';

const body = await client.instantTests.downloadResponseBody(testId, requestId, {
  run: 1,
  cached: false,
  step: 1,
});
await writeFile('wpt-response-body.bin', body.data);
console.log(body.contentType, body.data.byteLength);
```

The result has raw bytes in `data` and the response's `contentType` string, or `null` if the header is absent. The method downloads once and does not create or wait for a test. Response bodies may contain sensitive data; avoid printing their contents.

#### Download a static test artifact

Run [`example:enumerations`](#retrieve-enumerations), which calls `client.enumerations.list({ includeWptTestArtifactType: true })`, and take the numeric artifact type ID from the `WptTestArtifactType` section. The service can return JSON, text, HTML, or binary content depending on the type.

```js
import { writeFile } from 'node:fs/promises';

const artifact = await client.instantTests.downloadArtifact(testId, artifactTypeId, {
  run: 1,
  cached: false,
  step: 1,
});
await writeFile('wpt-artifact.bin', artifact.data);
console.log(artifact.contentType, artifact.data.byteLength);
```

The result contains a `Uint8Array` in `data` and the response's `contentType` string (or `null` if absent). All query fields are optional; the service defaults to run 1, first view (`cached: false`), and step 1. The method downloads once and does not create or wait for a test. Choose an output extension appropriate for the artifact type, and avoid printing raw artifact contents because they may contain sensitive data.

## Configuration and responses

Pass a non-empty `apiKey` when creating the client. The client handles authentication for each operation.

The client uses API v4 and an internal 30-second request timeout. Each request is attempted once; HTTP, network, and timeout failures are returned without automatic retries.

JSON operations return an object with operation-specific `data` and optional shared metadata:

- `messages`, `errors`, `completed`, and `traceId`.
- `usageLimits`, including `configCallLimit` and per-consumer `maxConfigCallsPerday` when provided by the API.
- `data.hasMore`, `data.next`, and `data.previous` when provided by the API.

Requests and responses have TypeScript types for compile-time checking; the client does not validate their shapes at runtime. JSON responses are returned as received, including additional fields. Artifact downloads return bytes and a content type as described above. Shared response fields are defined in [response.ts](src/api/v4/types/response.ts).

### Handle errors

HTTP, network, timeout, and response-body decoding failures throw `WebPageTestError`. Body-reading errors preserve the HTTP status, trace ID when available, and original cause. Invalid API-key or base-URL configuration throws `TypeError`; invalid timer settings throw `RangeError`. Request and response payload shapes are not validated at runtime.

```js
import { WebPageTestError } from 'webpagetest-node';

try {
  await client.nodes.list();
} catch (error) {
  if (error instanceof WebPageTestError) {
    console.error(error.message, error.status, error.traceId);
  }
  throw error;
}
```

`status` is available for HTTP failures and may be absent for network or timeout failures. Avoid logging the error's `cause`, which can contain response data.

## Development

Run all required checks from the repository root. ESLint checks JavaScript and TypeScript using recommended rules. All TypeScript source and test files are type-checked before the mocked HTTP tests run. The test configuration skips checking dependency declaration files because of a Vite/Rollup type incompatibility; project code remains checked with strict settings:

```sh
npm run check
```

Or run them separately:

```sh
npm run lint
npm run build
npm test
```

The implementation is organized as follows:

| Location | Responsibility |
| --- | --- |
| `src/api/v4/contract.ts` | Paths grouped by instant and scheduled tests; scheduled operations are not implemented yet. |
| `src/api/v4/types/` | TypeScript request, response, and shared data types. |
| `src/api/v4/endpoints/` | Public operations and HTTP request construction. |
| `src/api/v4/enums.ts` | Shared API enumeration values. |
| `src/core/config/defaults.ts` | Shared request timeout, polling, and waiting defaults. |
| `src/core/` | Configuration, errors, and HTTP transport. |

The exported `HttpClient` provides `request<T>()` for JSON responses and `download()` for complete response bytes with their content type.

## License

This project is licensed under the [Mozilla Public License 2.0](LICENSE). See the [official license text](https://www.mozilla.org/en-US/MPL/2.0/).
