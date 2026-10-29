export function readExampleConfig(env = process.env) {
  const apiKey = env.WPT_API_KEY;
  if (typeof apiKey !== 'string' || apiKey.trim().length === 0) {
    throw new Error('Set WPT_API_KEY to a non-empty value before running this example.');
  }

  const baseUrl = env.WPT_BASE_URL;
  if (baseUrl === undefined) return { apiKey };

  try {
    const url = new URL(baseUrl);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') throw new Error();
  } catch {
    throw new Error('WPT_BASE_URL must be a valid HTTP or HTTPS URL when set.');
  }

  return { apiKey, baseUrl };
}
