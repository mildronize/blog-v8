import { test, expect } from 'bun:test';

test('getIdFromPath', async () => {
  const getIdFromPath = (await import('./main')).getIdFromPath;
  const domain = 'https://example.com';

  expect(getIdFromPath(domain)).toBe(null);
  expect(getIdFromPath(domain + '/')).toBe(null);
  expect(getIdFromPath(domain + '/123')).toBe('123');
  expect(getIdFromPath(domain + '/123-456')).toBe('456');
  expect(getIdFromPath(domain + '/123-456-789')).toBe('789');
  expect(getIdFromPath(domain + '/123-456-789-')).toBe(null);

  expect(getIdFromPath(domain + '/123/')).toBe('123');
  expect(getIdFromPath(domain + '/123-456/')).toBe('456');
  expect(getIdFromPath(domain + '/123-456-789/')).toBe('789');

  // with query string
  expect(getIdFromPath(domain + '/123-456-789?query=string')).toBe('789');
  expect(getIdFromPath(domain + '/123-456-789/?query=string')).toBe('789');

});

