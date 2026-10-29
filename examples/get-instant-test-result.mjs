import { WebPageTest } from "../dist/index.js";

import { readExampleConfig } from "./utils/environment.mjs";
import { readTestIdArgument } from "./utils/test-id.mjs";

const config = readExampleConfig();
const testId = readTestIdArgument("example:result");
const client = new WebPageTest(config);
const response = await client.instantTests.result(testId, {
  includeWaterfall: false,
  includeFilmstrip: false,
  includeLighthouse: false,
});

const runs = response.data.runs ?? [];
if (runs.length === 0) {
  console.log("No run results were returned.");
} else {
  console.table(
    runs.map((run) => ({
      run: run.run,
      viewType: run.viewType?.name ?? run.viewType?.id,
      step: run.stepNum,
      timeToFirstByte: run.timeToFirstByte,
      largestContentfulPaint: run.largestContentfulPaint,
      cumulativeLayoutShift: run.cumulativeLayoutShift,
      totalBlockingTime: run.totalBlockingTime,
    })),
  );
}
