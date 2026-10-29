import { WebPageTest } from "../dist/index.js";

import { readExampleConfig } from "./utils/environment.mjs";

const config = readExampleConfig();

const client = new WebPageTest(config);
const response = await client.enumerations.list({
  includeConnectionType: true,
  includeDeviceType: true,
  includeDeviceResolution: true,
  includeAuthenticationMethodType: true,
  includeDeviceBrowserType: true,
  includeDomainStatus: true,
  includeDisplayTestFrequency: true,
  includeAlertInstructionType: true,
  includeAlertTriggerType: true,
  includeOperatorType: true,
  includeReminderFrequency: true,
  includeNotificationType: true,
  includeRunRepetitions: true,
  includeWptAlertMetric: true,
  includeTestReportMetricDataType: true,
  includeAlertGroupItemFilterType: true,
  includeAlertHistoricalTimeThreshold: true,
  includeAlertTimeThresholdInterval: true,
  includeAlertStateType: true,
  includeWptTestArtifactType: true,
});

for (const section of response.data.sections ?? []) {
  console.log(section.section);
  console.table(section.enumeration ?? []);
}
