import { WebPageTest } from "../dist/index.js";

import { readExampleConfig } from "./utils/environment.mjs";

const config = readExampleConfig();

const client = new WebPageTest(config);

const pageNumber = 0;
const pageSize = 20;
const search = process.argv[2];
const response = await client.history.list({
  pageNumber,
  pageSize,
  ...(search !== undefined ? { search } : {}),
});

const history = response.data.webpageTestHistory ?? [];
if (history.length === 0) {
  console.log("No tests found for the selected filters.");
} else {
  console.table(
    history.map((test) => ({
      id: test.id,
      url: test.url,
      status: test.status?.name,
      runTime: test.runTime,
      runs: test.runs,
    })),
  );
}

if (response.data.hasMore) {
  console.log(`More history is available. Set pageNumber to ${pageNumber + 1} to retrieve the next page.`);
}
