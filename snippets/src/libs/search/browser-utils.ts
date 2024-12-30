import urlJoin from "url-join";

/**
 * Join a hostname and a path together to form a URL.
 * 
 * If the hostname is undefined, it will return a path with a leading slash.
 * Due to `urlJoin` behavior, if the hostname is undefined, it ignores the leading slash.
 */
export function joinUrl(hostname: string | undefined, path: string): string {
  const url = urlJoin(hostname ?? '', path);
  if (!hostname) {
    return '/' + url;
  }
  return url;
}

