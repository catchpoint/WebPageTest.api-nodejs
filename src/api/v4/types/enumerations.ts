import type { ApiResponse, ResponseData } from './response.js';

export type EnumerationsQuery = {
  includeConnectionType?: boolean | undefined;
  includeDeviceType?: boolean | undefined;
  includeDeviceResolution?: boolean | undefined;
  includeAuthenticationMethodType?: boolean | undefined;
  includeDeviceBrowserType?: boolean | undefined;
  includeDomainStatus?: boolean | undefined;
  includeDisplayTestFrequency?: boolean | undefined;
  includeAlertInstructionType?: boolean | undefined;
  includeAlertTriggerType?: boolean | undefined;
  includeOperatorType?: boolean | undefined;
  includeReminderFrequency?: boolean | undefined;
  includeNotificationType?: boolean | undefined;
  includeRunRepetitions?: boolean | undefined;
  includeWptAlertMetric?: boolean | undefined;
  includeTestReportMetricDataType?: boolean | undefined;
  includeAlertGroupItemFilterType?: boolean | undefined;
  includeAlertHistoricalTimeThreshold?: boolean | undefined;
  includeAlertTimeThresholdInterval?: boolean | undefined;
  includeAlertStateType?: boolean | undefined;
  includeWptTestArtifactType?: boolean | undefined;
};

export type EnumerationsResponse = ApiResponse<ResponseData & {
  sections?: Array<{
    section?: string | null | undefined;
    enumeration?: Array<{
      enabledForScheduledTest?: boolean | null | undefined;
      enabledForInstantTest?: boolean | null | undefined;
      id: number;
      name?: string | null | undefined;
    }> | null | undefined;
  }> | null | undefined;
}>;
