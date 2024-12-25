import { Logger, ConsoleLogger } from "./logger";

export async function logTime(name: string, func: () => Promise<void> | void, logger: Logger = new ConsoleLogger()) {
  const start = Date.now();
  await func();
  logger.info(`"${name}" took ${Date.now() - start}ms`);
}
