import type { Enumeration } from './enumeration.js';

export type ResultAxe = {
  testEngine?: string | null | undefined;
  violations?: Array<ResultAxeViolation> | null | undefined;
};

export type ResultAxeViolation = {
  id?: string | null | undefined;
  impact?: string | null | undefined;
};

export type ResultBlockingRequests = {
  css?: Array<string> | null | undefined;
  js?: Array<string> | null | undefined;
  tp?: Array<string> | null | undefined;
  tpHosts?: Array<string> | null | undefined;
};

export type ResultBrowser = {
  id?: number | undefined;
  name?: string | null | undefined;
};

export type ResultCarbonFootprint = {
  sustainableWebDesign?: number | null | undefined;
  scale?: string | null | undefined;
  greenHostings?: Array<ResultHosting> | null | undefined;
};

export type ResultChunkItem = {
  start?: number | undefined;
  value?: number | undefined;
};

export type ResultConsoleMessage = {
  source?: string | null | undefined;
  level?: string | null | undefined;
  text?: string | null | undefined;
  url?: string | null | undefined;
  lineNumber?: number | null | undefined;
  column?: number | null | undefined;
  timestamp?: number | null | undefined;
};

export type ResultCpuBreakDown = {
  category?: string | null | undefined;
  time?: number | undefined;
};

export type ResultCpuCategorySlices = {
  category?: string | null | undefined;
  values?: Array<number> | null | undefined;
};

export type ResultCpuEvent = {
  proc?: string | null | undefined;
  time?: number | undefined;
};

export type ResultCpuSlices = {
  sliceMs?: number | undefined;
  averages?: Array<ResultCpuCategorySlices> | null | undefined;
};

export type ResultCpuTimes = {
  breakDown?: Array<ResultCpuBreakDown> | null | undefined;
  events?: Array<ResultCpuEvent> | null | undefined;
};

export type ResultCruxCollectionPeriod = {
  firstDate?: ResultCruxDate | undefined;
  lastDate?: ResultCruxDate | undefined;
};

export type ResultCruxDate = {
  year?: number | undefined;
  month?: number | undefined;
  day?: number | undefined;
};

export type ResultCruxKey = {
  formFactor?: string | null | undefined;
  url?: string | null | undefined;
};

export type ResultCruxMetricEntry = {
  key?: string | null | undefined;
  metric?: ResultCruxMetric | undefined;
};

export type ResultCruxMetric = {
  percentiles?: ResultCruxPercentile | undefined;
};

export type ResultCruxPercentile = {
  p75?: number | null | undefined;
};

export type ResultCrux = {
  key?: ResultCruxKey | undefined;
  metrics?: Array<ResultCruxMetricEntry> | null | undefined;
  collectionPeriod?: ResultCruxCollectionPeriod | undefined;
};

export type ResultCustomMetric = {
  name?: string | null | undefined;
  value?: string | null | undefined;
};

export type ResultDataPoint = {
  timestamp?: number | undefined;
  value?: number | undefined;
};

export type ResultExperimentConfiguration = {
  key?: string | null | undefined;
  descriptionVariables?: Array<string> | null | undefined;
  values?: Array<string> | null | undefined;
  isTip?: boolean | undefined;
};

export type ResultFont = {
  family?: string | null | undefined;
  display?: string | null | undefined;
  status?: string | null | undefined;
  style?: string | null | undefined;
  weight?: string | null | undefined;
};

export type ResultHosting = {
  url?: string | null | undefined;
  hasGoodFootprint?: boolean | null | undefined;
  error?: string | null | undefined;
};

export type ResultInstantTestAuthentication = {
  authenticationMethodType?: number | null | undefined;
  username?: string | null | undefined;
  password?: string | null | undefined;
  domains?: string | null | undefined;
};

export type ResultInteractivePeriod = {
  start?: number | undefined;
  end?: number | undefined;
};

export type ResultJsLibVulnerability = {
  severity?: string | null | undefined;
};

export type ResultLabel = {
  color?: string | null | undefined;
  id?: number | null | undefined;
  name?: string | null | undefined;
  values?: Array<string> | null | undefined;
};

export type ResultLayoutShiftAttribution = {
  previousRect?: ResultRect | undefined;
  currentRect?: ResultRect | undefined;
};

export type ResultLayoutShiftItem = {
  time?: number | undefined;
  score?: number | undefined;
  cumulativeScore?: number | undefined;
  windowScore?: number | undefined;
  shiftWindowNum?: number | undefined;
  rects?: Array<Array<number>> | null | undefined;
  sources?: Array<ResultLayoutShiftAttribution> | null | undefined;
};

export type ResultMainThreadBlockingTime = {
  origin?: string | null | undefined;
  time?: number | undefined;
};

export type ResultMedianMetric = {
  type?: Enumeration | undefined;
  index?: number | undefined;
};

export type ResultOpportunityConfiguration = {
  section?: string | null | undefined;
  name?: string | null | undefined;
  isGood?: boolean | undefined;
  titleVariables?: Array<string> | null | undefined;
  descriptionVariables?: Array<string> | null | undefined;
  examples?: Array<string> | null | undefined;
  experimentConfigurations?: Array<ResultExperimentConfiguration> | null | undefined;
};

export type ResultPageEvent = {
  metricType?: Enumeration | undefined;
  start?: number | undefined;
  duration?: number | undefined;
};

export type ResultPaintEventElement = {
  nodeName?: string | null | undefined;
  boundingRect?: ResultRect | undefined;
  outerHTML?: string | null | undefined;
  content?: string | null | undefined;
  src?: string | null | undefined;
  currentSrc?: string | null | undefined;
};

export type ResultPaintEvent = {
  event?: string | null | undefined;
  time?: number | undefined;
  size?: number | undefined;
  element?: ResultPaintEventElement | undefined;
  type?: string | null | undefined;
  url?: string | null | undefined;
};

export type ResultRect = {
  x?: number | undefined;
  y?: number | undefined;
  width?: number | undefined;
  height?: number | undefined;
  top?: number | undefined;
  right?: number | undefined;
  bottom?: number | undefined;
  left?: number | undefined;
};

export type ResultRequestImage = {
  number?: number | undefined;
  src?: string | null | undefined;
  imageTotal?: number | null | undefined;
  imageSave?: number | null | undefined;
  bytesIn?: number | null | undefined;
  jpegScanCount?: number | null | undefined;
  contentType?: string | null | undefined;
};

export type ResultRunRequestItem = {
  cacheTime?: number | null | undefined;
  contentEncoding?: string | null | undefined;
  downloadStart?: number | null | undefined;
  downloadEnd?: number | null | undefined;
  cpuTime?: number | null | undefined;
  priority?: string | null | undefined;
  socket?: string | null | undefined;
  loadStart?: number | null | undefined;
  preloadUnused?: string | null | undefined;
  redirectLocations?: Array<string> | null | undefined;
  id?: string | null | undefined;
  isBasePage?: boolean | undefined;
  fullUrl?: string | null | undefined;
  host?: string | null | undefined;
  initiator?: string | null | undefined;
  isRenderBlocking?: boolean | undefined;
  renderBlocking?: string | null | undefined;
  contentTypeStr?: string | null | undefined;
  requestType?: string | null | undefined;
  allEnd?: number | null | undefined;
  isSecureRequest?: boolean | undefined;
  responseCode?: number | undefined;
  isThirdParty?: boolean | undefined;
  url?: string | null | undefined;
  duration?: number | null | undefined;
  startTime?: number | null | undefined;
  endTime?: number | null | undefined;
  ttfbStart?: number | null | undefined;
  ttfbEnd?: number | null | undefined;
  connectStart?: number | null | undefined;
  connectEnd?: number | null | undefined;
  connectMs?: number | null | undefined;
  blockingTime?: number | null | undefined;
  scoreKeepAlive?: number | undefined;
  scoreGzip?: number | undefined;
  scoreCompress?: number | undefined;
  scoreProgressiveJpeg?: number | null | undefined;
  scoreCache?: number | undefined;
  scoreCdn?: number | undefined;
  bytesIn?: number | undefined;
  objectSizeUncompressed?: number | null | undefined;
  gzipTotal?: number | null | undefined;
  gzipSave?: number | null | undefined;
  cdnProvider?: string | null | undefined;
  imageTotal?: number | null | undefined;
  imageSave?: number | null | undefined;
  waitTiming?: ResultChunkItem | undefined;
  connectTiming?: ResultChunkItem | undefined;
  dnsTiming?: ResultChunkItem | undefined;
  sslTiming?: ResultChunkItem | undefined;
  chunks?: Array<ResultChunkItem> | null | undefined;
  contentType?: Enumeration | undefined;
  status?: Enumeration | undefined;
  cardinality?: number | undefined;
  jsTimings?: Array<ResultChunkItem> | null | undefined;
};

export type ResultTestRunItem = {
  requests?: Array<ResultRunRequestItem> | null | undefined;
  customMetrics?: Array<ResultCustomMetric> | null | undefined;
  initialUrl?: string | null | undefined;
  initialHost?: string | null | undefined;
  largestContentfulPaintType?: string | null | undefined;
  largestContentfulPaintNodeType?: string | null | undefined;
  largestContentfulPaintImageURL?: string | null | undefined;
  metaViewport?: string | null | undefined;
  eventName?: string | null | undefined;
  requestImages?: Array<ResultRequestImage> | null | undefined;
  blockingRequests?: ResultBlockingRequests | undefined;
  opportunityConfigurations?: Array<ResultOpportunityConfiguration> | null | undefined;
  imgsInViewport?: Array<ResultViewportImage> | null | undefined;
  imgsOutViewport?: Array<ResultViewportImage> | null | undefined;
  fonts?: Array<ResultFont> | null | undefined;
  carbonFootprint?: ResultCarbonFootprint | undefined;
  cpuUtilization?: ResultUtilization | undefined;
  bwUtilization?: ResultUtilization | undefined;
  interactivePeriods?: Array<ResultInteractivePeriod> | null | undefined;
  cpuSlices?: ResultCpuSlices | undefined;
  run?: number | undefined;
  viewType?: Enumeration | undefined;
  stepNum?: number | undefined;
  timeToFirstByte?: number | undefined;
  docTime?: number | undefined;
  fullyLoaded?: number | undefined;
  bytesOut?: number | undefined;
  bytesOutDoc?: number | undefined;
  bytesIn?: number | undefined;
  bytesInDoc?: number | undefined;
  firstContentfulPaint?: number | undefined;
  firstMeaningfulPaint?: number | undefined;
  totalBlockingTime?: number | null | undefined;
  largestContentfulPaint?: number | null | undefined;
  cumulativeLayoutShift?: number | null | undefined;
  renderBlockingJS?: number | undefined;
  renderBlockingCSS?: number | undefined;
  generatedContentSize?: number | undefined;
  generatedContentPercent?: number | undefined;
  render?: number | undefined;
  speedIndex?: number | undefined;
  possiblyRenderBlockingReq?: Array<string> | null | undefined;
  jsLibsVulns?: Array<ResultJsLibVulnerability> | null | undefined;
  videoFrames?: Array<ResultVideoFrameItem> | null | undefined;
  layoutShifts?: Array<ResultLayoutShiftItem> | null | undefined;
  screenShot?: string | null | undefined;
  pageEvents?: Array<ResultPageEvent> | null | undefined;
  largestPaints?: Array<ResultPaintEvent> | null | undefined;
  axe?: ResultAxe | undefined;
  visualComplete?: number | undefined;
  visualComplete85?: number | null | undefined;
  visualComplete90?: number | null | undefined;
  visualComplete95?: number | null | undefined;
  visualComplete99?: number | null | undefined;
  lastVisualChange?: number | undefined;
  domContentLoadedEventStart?: number | undefined;
  titleTime?: number | undefined;
  fullyLoadedCPUms?: number | undefined;
  viewport?: ResultViewport | undefined;
  scoreCache?: number | undefined;
  scoreCdn?: number | undefined;
  scoreGzip?: number | undefined;
  scoreKeepAlive?: number | undefined;
  gzipTotal?: number | null | undefined;
  gzipSavings?: number | null | undefined;
  scoreCompress?: number | undefined;
  scoreProgressiveJpeg?: number | undefined;
  imageTotal?: number | undefined;
  imageSavings?: number | undefined;
  cpuTimes?: ResultCpuTimes | undefined;
  consoleLog?: Array<ResultConsoleMessage> | null | undefined;
  mainThreadBlockingTimes?: Array<ResultMainThreadBlockingTime> | null | undefined;
};

export type ResultUtilization = {
  data?: Array<ResultDataPoint> | null | undefined;
  max?: number | undefined;
};

export type ResultVideoFrameItem = {
  time?: number | undefined;
  image?: string | null | undefined;
  visuallyComplete?: number | undefined;
};

export type ResultViewportImage = {
  src?: string | null | undefined;
  html?: string | null | undefined;
  currentSrc?: string | null | undefined;
  srcset?: string | null | undefined;
  priority?: string | null | undefined;
  sizes?: string | null | undefined;
  loading?: string | null | undefined;
  naturalWidth?: number | null | undefined;
  naturalHeight?: number | null | undefined;
};

export type ResultViewport = {
  width?: number | undefined;
  height?: number | undefined;
};
