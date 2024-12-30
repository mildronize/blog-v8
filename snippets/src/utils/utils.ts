import { ConsoleLogger } from "./console-logger";
import { Logger } from "./logger";

export async function logTime(name: string, func: () => Promise<any> | any, logger: Logger = new ConsoleLogger()) {
  const start = Date.now();
  await func();
  logger.info(`"${name}" took ${Date.now() - start}ms`);
}


/**
 * Hash a string to a fixed-length alphanumeric string.
 */
export function hashString(input: string, charLimit = 6) {
  const hash = input.split('').reduce((hash, char) => {
    return ((hash << 5) - hash + char.charCodeAt(0)) | 0;
  }, 0);
  return Math.abs(hash).toString(36).slice(0, charLimit); // Convert to base-36 and truncate
}
