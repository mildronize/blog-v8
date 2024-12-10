
/**
 * Redirect with src=404 in the URL
 */
const SOURCE_VALUE = '404';

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


/**
 * This script is used to redirect the user to the correct page when they land on a 404 page.
 * It extracts the ID from the URL and checks if there is a mapping for that ID in the `id-mapper.json` file.
 * If there is a mapping, it redirects the user to the correct page.
 */

async function autoResolveBrokenUrl() {

  if (typeof window === 'undefined') return;
  const href = window.location.href;
  console.log(`Current URL: ${href}`);
  let id: string | null = null;
  const idFromPath = getIdFromPath(href);
  if (idFromPath) {
    id = idFromPath;
    console.log(`Extracted ID from path: ${id}`);
  }
  const currentUrl = new URL(href);
  const idFromSearchParams = currentUrl.searchParams.get('id');
  if (idFromSearchParams) {
    id = idFromSearchParams;
    console.log(`Extracted ID from search params: ${id}`);
  }
  if (id === null) {
    console.log('No ID found in the URL');
    return;
  }

  console.log(`Extracted ID: ${id}`);

  const idMapper = await (await fetch(`/api/id-mapper.json`)).json();
  const newUrl = idMapper[id] as { path: string };
  const targetUrl = new URL(newUrl.path, window.location.origin);
  targetUrl.searchParams.set('src', SOURCE_VALUE);
  if (newUrl) {
    window.location.assign(targetUrl.toString());
  }

};

autoResolveBrokenUrl();
