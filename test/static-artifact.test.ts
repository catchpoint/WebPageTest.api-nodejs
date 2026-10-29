import { afterEach, describe, expect, it, vi } from 'vitest';

import { WebPageTest } from '../src/index.js';

const artifactBytes = Uint8Array.from([0, 10, 255, 42]);

describe('static artifact download', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('returns raw bytes and content type with the requested artifact filters', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(artifactBytes, {
      headers: { 'content-type': 'application/vnd.tcpdump.pcap' },
    }));
    vi.stubGlobal('fetch', fetchMock);

    const client = new WebPageTest({ apiKey: 'test-key', baseUrl: 'https://example.test' });
    const artifact = await client.instantTests.downloadArtifact(123, 7, { run: 2, cached: false, step: 0 });

    expect(artifact).toEqual({ data: artifactBytes, contentType: 'application/vnd.tcpdump.pcap' });
    const [url, init] = fetchMock.mock.calls[0] as [URL, RequestInit];
    expect(url.pathname).toBe('/api/v4/webpagetest/results/123/files/7');
    expect(Object.fromEntries(url.searchParams)).toEqual({ run: '2', cached: 'false', step: '0' });
    expect(init.method).toBeUndefined();
    expect(new Headers(init.headers).get('Accept')).toBe('*/*');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('omits unspecified query values and preserves a missing content type', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(null));
    vi.stubGlobal('fetch', fetchMock);

    const artifact = await new WebPageTest({ apiKey: 'test-key' }).instantTests.downloadArtifact(123, 7);

    expect(artifact.data).toEqual(new Uint8Array());
    expect(artifact.contentType).toBeNull();
    expect((fetchMock.mock.calls[0]?.[0] as URL).search).toBe('');
  });

  it('returns an HTTP error after one failed attempt', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('{"error":"missing"}', {
      status: 404,
      headers: { 'x-trace-id': 'trace-123' },
    }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(new WebPageTest({ apiKey: 'test-key' }).instantTests.downloadArtifact(123, 7))
      .rejects.toMatchObject({ name: 'WebPageTestError', status: 404, traceId: 'trace-123', cause: '{"error":"missing"}' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('preserves HTTP context when reading an artifact fails', async () => {
    const readError = new Error('body read failed');
    const response = new Response('artifact', { headers: { 'x-trace-id': 'trace-123' } });
    vi.spyOn(response, 'arrayBuffer').mockRejectedValue(readError);
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(response));

    await expect(new WebPageTest({ apiKey: 'test-key' }).instantTests.downloadArtifact(123, 7))
      .rejects.toMatchObject({ name: 'WebPageTestError', status: 200, traceId: 'trace-123', cause: readError });
  });
});
