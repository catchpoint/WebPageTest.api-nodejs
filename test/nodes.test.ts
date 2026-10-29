import { afterEach, describe, expect, it, vi } from 'vitest';
import { WebPageTest } from '../src/index.js';

afterEach(() => vi.unstubAllGlobals());

describe('nodes endpoint', () => {
  it.each([undefined, 0, 1])('serializes the status filter and preserves node objects: %s', async (statusId) => {
    const response = { data: { nodes: [{ id: 1, changeDate: '2026-10-02T12:30:35.347', networkType: { id: 1, name: 'Example' } }] } };
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify(response)));
    vi.stubGlobal('fetch', fetchMock);
    const client = new WebPageTest({ apiKey: 'test-key' });
    await expect(client.nodes.list({ statusId })).resolves.toEqual(response);
    const url = fetchMock.mock.calls[0]![0] as URL;
    expect(url.pathname).toBe('/api/v4/webpagetest/nodes');
    expect(url.search).toBe(statusId === undefined ? '' : `?statusId=${statusId}`);
  });
});
