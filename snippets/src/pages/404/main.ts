
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

(async () => {

  if (typeof window === 'undefined') return;
  const href = window.location.href;
  console.log(`Current URL: ${href}`);
  const id = getIdFromPath(href);
  if (id === null) {
    console.log('No ID found in the URL');
    return;
  }

  console.log(`Extracted ID: ${id}`);

  const idMapper = await (await fetch(`/api/id-mapper.json`)).json();
  const newUrl = idMapper[id] as { path: string };
  if (newUrl) {
    window.location.assign(newUrl.path);
  }

})();
