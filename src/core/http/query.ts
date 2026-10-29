export function withQuery(path: string, query: object): string {
  const params = new URLSearchParams();
  for (const [name, value] of Object.entries(query)) {
    if (value !== undefined) params.set(name, String(value));
  }
  return params.size > 0 ? `${path}?${params}` : path;
}
