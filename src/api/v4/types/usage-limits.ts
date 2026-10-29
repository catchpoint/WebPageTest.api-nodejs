export interface UsageLimit {
  minute?: number | undefined;
  hour?: number | undefined;
  day?: number | undefined;
}

export interface ConsumerStatistics {
  consumerId?: number | undefined;
  requestCount?: UsageLimit | undefined;
  maxPerDay?: number | null | undefined;
  maxConfigCallsPerday?: number | null | undefined;
}

export interface DivisionUsageStatistics {
  divisionId?: number | undefined;
  consumerStatistics?: ConsumerStatistics[] | null | undefined;
}

export interface UsageLimits {
  clientId?: number | undefined;
  lastRequestTimestamp?: string | undefined;
  limits?: UsageLimit | undefined;
  configCallLimit?: UsageLimit | undefined;
  runs?: UsageLimit | undefined;
  exceededMessage?: string | null | undefined;
  divisionUsageStatistics?: DivisionUsageStatistics[] | null | undefined;
}
