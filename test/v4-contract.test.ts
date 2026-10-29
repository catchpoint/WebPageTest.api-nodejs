import { afterEach, describe, expect, it, vi } from 'vitest';

import type { EnumerationsQuery } from '../src/index.js';
import { WebPageTest } from '../src/index.js';

const usageLimits = {
  clientId: 1,
  lastRequestTimestamp: '2026-10-01T12:00:00Z',
  limits: { minute: 10, hour: 100, day: 1000 },
  configCallLimit: { minute: 5, hour: 50, day: 500 },
  runs: { minute: 1, hour: 10, day: 100 },
  exceededMessage: null,
  divisionUsageStatistics: [{
    divisionId: 2,
    consumerStatistics: [{
      consumerId: 3,
      requestCount: { minute: 1, hour: 2, day: 3 },
      maxPerDay: null,
      maxConfigCallsPerday: 500,
    }],
  }],
};

describe('v4 endpoint contracts', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('serializes all supported enumeration query options together', async () => {
    const query: EnumerationsQuery = {
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
    };

    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ data: {} })));
    vi.stubGlobal('fetch', fetchMock);
    await new WebPageTest({ apiKey: 'test-key' }).enumerations.list(query);
    expect(Object.fromEntries(fetchMock.mock.calls[0]![0].searchParams)).toEqual(Object.fromEntries(Object.keys(query).map(key => [key, 'true'])));
  });

  it.each([true, false, undefined])('serializes the artifact type filter (%s)', async (includeWptTestArtifactType) => {
    const response = { data: { sections: [{ section: 'WptTestArtifactType', enumeration: [{ id: 1, name: 'Example artifact' }] }] }, usageLimits };
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify(response)));
    vi.stubGlobal('fetch', fetchMock);
    const client = new WebPageTest({ apiKey: 'test-key', baseUrl: 'https://example.test' });

    await expect(client.enumerations.list({ includeWptTestArtifactType })).resolves.toEqual(response);
    const url = fetchMock.mock.calls[0]?.[0] as URL;
    expect(url.pathname).toBe('/api/v4/webpagetest/enumerations');
    expect(url.search).toBe(includeWptTestArtifactType === undefined ? '' : `?includeWptTestArtifactType=${includeWptTestArtifactType}`);
  });

  it.each(['history', 'nodes', 'enumerations', 'result', 'rerun', 'create'])('preserves shared metadata for %s', async (operation) => {
    const response = { data: { id: 1 }, usageLimits, messages: [], errors: null, completed: true };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify(response))));
    const client = new WebPageTest({ apiKey: 'test-key' });
    const requests: Record<string, () => Promise<unknown>> = {
      history: () => client.history.list(), nodes: () => client.nodes.list(),
      enumerations: () => client.enumerations.list(), result: () => client.instantTests.result(1),
      rerun: () => client.instantTests.rerun(1), create: () => client.instantTests.create({ url: 'https://example.com', deviceType: 1 }),
    };
    await expect(requests[operation]!()).resolves.toEqual(response);
  });
});
