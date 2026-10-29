export type ResultAuditRef = {
  id?: string | null | undefined;
  weight?: number | undefined;
  group?: string | null | undefined;
  acronym?: string | null | undefined;
  relevantAudits?: Array<string> | null | undefined;
};

export type ResultAudit = {
  id?: string | null | undefined;
  title?: string | null | undefined;
  description?: string | null | undefined;
  score?: number | null | undefined;
  scoreDescription?: string | null | undefined;
  scoreDisplayMode?: string | null | undefined;
  displayValue?: string | null | undefined;
  details?: ResultDetailsBase | undefined;
  numericValue?: number | null | undefined;
  numericUnit?: string | null | undefined;
  explanation?: string | null | undefined;
  warnings?: Array<string> | null | undefined;
  errorMessage?: string | null | undefined;
};

export type ResultCategoryGroup = {
  title?: string | null | undefined;
  description?: string | null | undefined;
};

export type ResultCategory = {
  performance?: ResultCategoryValue | undefined;
  accessibility?: ResultCategoryValue | undefined;
  bestPractices?: ResultCategoryValue | undefined;
  seo?: ResultCategoryValue | undefined;
  pwa?: ResultCategoryValue | undefined;
};

export type ResultCategoryValue = {
  title?: string | null | undefined;
  description?: string | null | undefined;
  manualDescription?: string | null | undefined;
  supportedModes?: Array<string> | null | undefined;
  auditRefs?: Array<ResultAuditRef> | null | undefined;
  id?: string | null | undefined;
  score?: number | null | undefined;
};

export type ResultChildren = {
  name?: string | null | undefined;
  resourceBytes?: number | null | undefined;
  unusedBytes?: number | null | undefined;
};

export type ResultConfigSettings = {
  screenEmulation?: ResultScreenEmulation | undefined;
  locale?: string | null | undefined;
};

export type ResultDetailsBase = {
  type?: string | null | undefined;
  overallSavingsMs?: number | null | undefined;
  overallSavingsBytes?: number | null | undefined;
  debugData?: Record<string, unknown> | null | undefined;
  nodes?: Array<ResultNodes> | null | undefined;
};

export type ResultLighthouse = {
  audits?: Record<string, ResultAudit> | null | undefined;
  categories?: ResultCategory | undefined;
  categoryGroups?: Record<string, ResultCategoryGroup> | null | undefined;
  configSettings?: ResultConfigSettings | undefined;
  treeMapUri?: string | null | undefined;
  requestedUrl?: string | null | undefined;
  finalUrl?: string | null | undefined;
  runtimeError?: ResultRuntimeError | undefined;
  runWarnings?: Array<string> | null | undefined;
};

export type ResultNodes = {
  name?: string | null | undefined;
  resourceBytes?: number | null | undefined;
  unusedBytes?: number | null | undefined;
  children?: Array<ResultChildren> | null | undefined;
};

export type ResultRuntimeError = {
  code?: string | null | undefined;
  message?: string | null | undefined;
};

export type ResultScreenEmulation = {
  width?: number | undefined;
  height?: number | undefined;
  disabled?: boolean | undefined;
};
