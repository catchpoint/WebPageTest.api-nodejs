import type { Enumeration } from './enumeration.js';
import type { ApiResponse, ResponseData } from './response.js';

export type InstantTestCreateRequest = {
  divisionId?: number | null | undefined;
  connectionType?: number | null | undefined;
  speedUp?: number | null | undefined;
  speedDown?: number | null | undefined;
  roundTripTime?: number | null | undefined;
  packetLoss?: number | null | undefined;
  customMetrics?: string | null | undefined;
  notes?: string | null | undefined;
  authentication?: {
    authenticationMethodType?: number | null | undefined;
    username?: string | null | undefined;
    password?: string | null | undefined;
    domains?: string | null | undefined;
  } | undefined;
  advancedSettings?: {
    captureFullSizeVideo?: boolean | undefined;
    includeBodies?: boolean | null | undefined;
    tcpDump?: boolean | null | undefined;
    web10?: boolean | null | undefined;
    noImages?: boolean | null | undefined;
    noopt?: boolean | null | undefined;
    pngss?: boolean | null | undefined;
    minTestDuration?: number | null | undefined;
    stopAtDocumentComplete?: boolean | undefined;
    preserveUserAgent?: boolean | undefined;
    appendUserAgent?: string | null | undefined;
    customUserAgent?: string | null | undefined;
    disableAvif?: boolean | undefined;
    disableWebp?: boolean | undefined;
    ignoreSsl?: boolean | undefined;
    customHeaders?: Record<string, string> | null | undefined;
    injectScript?: string | null | undefined;
    injectScriptAllFrames?: boolean | undefined;
  } | undefined;
  chromiumParameters?: {
    netlog?: boolean | null | undefined;
    trace?: boolean | null | undefined;
    traceCategories?: string | null | undefined;
    profiler?: boolean | null | undefined;
    v8Rcs?: boolean | null | undefined;
    carbonControl?: boolean | undefined;
    useDevToolsTrafficShaper?: boolean | undefined;
    hostResolverRules?: string | null | undefined;
    cmdLine?: string | null | undefined;
    captureDevToolsTimeline?: boolean | undefined;
  } | undefined;
  url: string;
  runs?: number | undefined;
  nodeId?: number | undefined;
  deviceType: number;
  deviceResolution?: number | null | undefined;
  firstViewOnly?: boolean | undefined;
  lighthouse?: boolean | undefined;
  performance?: boolean | undefined;
  labels?: Array<{
    color?: string | null | undefined;
    id?: number | undefined;
    name: string;
    values?: Array<string> | null | undefined;
    changeLogObjectType?: Enumeration | undefined;
  }> | null | undefined;
  script?: {
    body?: string | null | undefined;
    containsSensitiveData?: boolean | undefined;
    discardHeaders?: boolean | undefined;
  } | undefined;
  blockRequest?: Array<string> | null | undefined;
  blockDomain?: Array<string> | null | undefined;
  spof?: Array<string> | null | undefined;
};

export type InstantTestCreateResponse = ApiResponse<ResponseData & {
  id: number;
}>;
