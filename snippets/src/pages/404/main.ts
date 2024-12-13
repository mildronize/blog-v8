import z from 'zod';

const idMapperSchema = z.record(
  z.union([
    z.undefined(),
    z.object({
      path: z.string(),
    })]
  )
);

const sourceMap = {
  /**
   * Redirect with src=404 in the URL
   */
  notFound: '404',
  shortUrl: 'short-url',
}

export function getIdFromPath(url: string): string | null {
  const urlObj = new URL(url);
  const trimmedUrl = urlObj.pathname.replace(/\/$/, '');
  const parts = trimmedUrl.split('-');

  if (parts.length > 1)
    return parts[parts.length - 1] === '' ? null : parts[parts.length - 1];
  else {
    const partsPath = trimmedUrl.split('/');
    if (partsPath.length > 1) {
      return partsPath[partsPath.length - 1] === '' ? null : partsPath[partsPath.length - 1];
    }
    return null;
  }
}

function extractIdFromUrl(url: string): string | null {
  let id: string | null = null;
  const idFromPath = getIdFromPath(url);
  if (idFromPath) {
    id = idFromPath;
    console.log(`Extracted ID from path: ${id}`);
  }
  const currentUrl = new URL(url);
  const idFromSearchParams = currentUrl.searchParams.get('id');
  if (idFromSearchParams) {
    id = idFromSearchParams;
    console.log(`Extracted ID from search params: ${id}`);
  }
  return id;
}

export function identityRedirectType(url: string): keyof typeof sourceMap {
  const currentUrl = new URL(url);
  const src = currentUrl.searchParams.get('src');
  if (src) {
    return src as keyof typeof sourceMap;
  }
  return 'shortUrl';
}

function redirectUserToCorrectPage(path: string | undefined, hostOrigin: string, redirectType: keyof typeof sourceMap) {
  if (!path) {
    console.log('No mapping found for the ID');
    return;
  }
  const targetUrl = new URL(path, hostOrigin);
  targetUrl.searchParams.set('src', sourceMap[redirectType]);
  window.location.assign(targetUrl.toString());
}

/**
 * This script is used to redirect the user to the correct page when they land on a 404 page.
 * It extracts the ID from the URL and checks if there is a mapping for that ID in the `id-mapper.json` file.
 * If there is a mapping, it redirects the user to the correct page.
 */

async function autoResolveBrokenUrl() {
  if (typeof window === 'undefined') return;
  const href = window.location.href;
  console.log(`Current URL: ${href}`);
  const id = extractIdFromUrl(href);
  if (id === null) {
    console.log('No ID found in the URL');
    return;
  }
  console.log(`Extracted ID: ${id}`);

  const idMapperResponse = await (await fetch(`/api/id-mapper.json`)).json() as unknown;
  const idMapper = idMapperSchema.parse(idMapperResponse);
  redirectUserToCorrectPage(idMapper[id]?.path, window.location.origin, 'notFound');
};

autoResolveBrokenUrl();
