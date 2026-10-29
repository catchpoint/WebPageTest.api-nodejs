import { setTimeout as delay } from "node:timers/promises";

import { validateSettings } from "../../../core/config/config.js";
import { withQuery } from "../../../core/http/query.js";
import type { HttpClient } from "../../../core/http/client.js";
import type { Settings } from "../../../core/config/config.js";
import type { Logger } from "../../../core/logger.js";

import { v4Contract } from "../contract.js";
import { InstantTestStatus, TestWaitErrorCode } from "../enums.js";
import { TestWaitError } from "../errors/test-wait-error.js";
import type { InstantTestResultQuery, InstantTestResultResponse } from "../types/instant-test-result.js";
import type { InstantTestStatusResponse } from "../types/instant-test-status.js";
import type { InstantTestCreateRequest, InstantTestCreateResponse } from "../types/instant-test.js";
import type { RerunRequest, RerunResponse } from "../types/rerun.js";
import type { InstantTestResultOptions } from "../types/instant-test-result-options.js";
import type { InstantTestScreenshotResponse } from "../types/instant-test-screenshot.js";
import type { ResponseBodyDownload, ResponseBodyQuery } from "../types/response-body.js";
import type { StaticArtifactDownload, StaticArtifactQuery } from "../types/static-artifact.js";

export class InstantTestEndpoint {
  constructor(private readonly http: HttpClient, private readonly logger: Logger, private readonly settings: Required<Settings>) {}

  async result(testId: number, query: InstantTestResultQuery = {}, resultOptions: InstantTestResultOptions = {}, settings: Settings = {}): Promise<InstantTestResultResponse> {
    if (!resultOptions.wait) {
      return this.fetchResult(testId, query);
    }
    const pollIntervalMs = settings.pollIntervalMs ?? this.settings.pollIntervalMs;
    const timeoutMs = settings.timeoutMs ?? this.settings.timeoutMs;
    validateSettings({ pollIntervalMs, timeoutMs });

    const deadline = new AbortController();
    const timer = setTimeout(() => deadline.abort(), timeoutMs);
    const signal = deadline.signal;
    try {
      signal.throwIfAborted();
      this.logger?.info(`Waiting for test ${testId} to complete (timeout: ${timeoutMs / 1000}s).`);
      while (true) {
        signal.throwIfAborted();
        this.logger?.info(`Checking status of test ${testId}...`);
        const status = await this.fetchStatus(testId, signal);
        signal.throwIfAborted();
        switch (status?.data?.statusTypeId) {
          case InstantTestStatus.Completed: {
            this.logger?.info(`Test ${testId} completed. Retrieving results...`);
            const result = await this.fetchResult(testId, query, signal);
            signal.throwIfAborted();
            this.logger?.info(`Results received for test ${testId}.`);
            return result;
          }
          case InstantTestStatus.Timeout:
            this.logger?.warn(`Test ${testId} expired before execution (server scheduling timeout).`);
            throw new TestWaitError(
              TestWaitErrorCode.TestTimeout,
              testId,
              "The test was not executed within the server scheduling window (approximately two hours).",
            );
          case InstantTestStatus.Running:
            this.logger?.info(`Test ${testId} is running.${typeof status.data.queuePosition === 'number' ? ` Queue position: ${status.data.queuePosition}.` : ''} Next check in ${pollIntervalMs / 1000}s.`);
            await delay(pollIntervalMs, undefined, { signal });
            break;
          default:
            throw new TestWaitError(
              TestWaitErrorCode.UnknownStatus,
              testId,
              "The server returned an unknown or missing test status.",
            );
        }
      }
    } catch (error) {
      if (signal.aborted) {
        throw new TestWaitError(
          TestWaitErrorCode.Timeout,
          testId,
          "Timed out waiting for test results.",
        );
      }
      throw error;
    } finally {
      clearTimeout(timer);
    }
  }

  status(testId: number): Promise<InstantTestStatusResponse> {
    return this.fetchStatus(testId);
  }

  screenshot(testId: number): Promise<InstantTestScreenshotResponse> {
    return this.http.request<InstantTestScreenshotResponse>(v4Contract.endpoints.instantTests.screenshot(testId));
  }

  downloadResponseBody(testId: number, requestId: string, query: ResponseBodyQuery = {}): Promise<ResponseBodyDownload> {
    return this.http.download(withQuery(v4Contract.endpoints.instantTests.responseBody(testId), { ...query, requestId }));
  }

  downloadArtifact(testId: number, artifactType: number, query: StaticArtifactQuery = {}): Promise<StaticArtifactDownload> {
    return this.http.download(withQuery(v4Contract.endpoints.instantTests.artifact(testId, artifactType), query));
  }

  rerun(testId: RerunRequest): Promise<RerunResponse> {
    return this.http.request<RerunResponse>(v4Contract.endpoints.instantTests.rerun(testId), { method: "POST" });
  }

  create(request: InstantTestCreateRequest): Promise<InstantTestCreateResponse> {
    return this.http.request<InstantTestCreateResponse>(v4Contract.endpoints.instantTests.test, {
      method: "POST",
      body: JSON.stringify(request),
    });
  }

  private fetchStatus(testId: number, signal?: AbortSignal): Promise<InstantTestStatusResponse> {
    return this.http.request<InstantTestStatusResponse>(v4Contract.endpoints.instantTests.status(testId), { method: "GET", signal: signal ?? null });
  }

  private fetchResult(testId: number, query: InstantTestResultQuery, signal?: AbortSignal): Promise<InstantTestResultResponse> {
    return this.http.request<InstantTestResultResponse>(withQuery(v4Contract.endpoints.instantTests.result(testId), query), { signal: signal ?? null });
  }
}
