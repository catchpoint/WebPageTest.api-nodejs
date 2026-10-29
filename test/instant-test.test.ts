import { afterEach, describe, expect, it, vi } from 'vitest';
import { WebPageTest } from '../src/index.js';

afterEach(() => vi.unstubAllGlobals());

describe('instant test creation', () => {
  it('posts the request unchanged and preserves additional response fields', async () => {
    const request = { url: 'https://example.com', deviceType: 1, labels: [{ name: 'Example', changeLogObjectType: { id: 1, name: 'Example' } }] };
    const response = { data: { id: 42, additionalField: true }, completed: true };
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify(response)));
    vi.stubGlobal('fetch', fetchMock);
    const client = new WebPageTest({ apiKey: 'test-key' });
    await expect(client.instantTests.create(request)).resolves.toEqual(response);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url.pathname).toBe('/api/v4/webpagetest/test');
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body)).toEqual(request);
  });
});
