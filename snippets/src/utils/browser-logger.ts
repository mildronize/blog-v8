
import { config } from "../_config";
import { Logger, LogLevel } from "./logger";
import { hashString } from "./utils";

export const createLogger = (scope: string): BrowserLogger | undefined => new BrowserLogger(scope, config.logLevel);

export class BrowserLogger implements Logger {
  private static readonly LEVELS = ["DEBUG", "INFO", "WARN", "ERROR", "FATAL"];
  private logLevelIndex: number;

  constructor(private scope?: string, level: LogLevel = "debug") {
    this.logLevelIndex = BrowserLogger.LEVELS.indexOf(level.toUpperCase());
    if (this.logLevelIndex === -1) {
      throw new Error(`Invalid log level: ${level}. Valid levels are ${BrowserLogger.LEVELS.join(", ")}.`);
    }
  }

  private formatMessage(level: string, messages: unknown[], hash?: string): string {
    const prefix = this.scope ? `[${this.scope}]` : "[Default]";
    const hashMessage = hash ? `(#${hash})` : "";
    const message = messages.map((m) => String(m)).join(" ");
    return `${level.toUpperCase()}:${hashMessage} ${prefix} ${message}`;
  }

  private debugMessage(messages: unknown[]): string | undefined {
    const hasObject = messages.some(message => typeof message !== "string");
    const msg = messages.map((m) => String(m)).join(" ");
    const hash = hasObject ? hashString(msg) : undefined;
    if (!hasObject) return undefined;
    // Log non-string values
    for (let i = 0; i < messages.length; i++) {
      if (typeof messages[i] !== "string") console.debug(`#${hash}/${i}:`, messages[i]);
    }
    return hash;
  }

  private logMessage(level: LogLevel, messages: unknown[]) {
    const levelIndex = BrowserLogger.LEVELS.indexOf(level.toUpperCase());
    if (levelIndex < this.logLevelIndex) return;
    const hash = this.debugMessage(messages);
    const formattedMessage = this.formatMessage(level, messages, hash);

    if (level === "debug") return console.debug(formattedMessage);
    if (level === "info") return console.info(formattedMessage);
    if (level === "warn") return console.warn(formattedMessage);
    return console.error(formattedMessage);
  }

  info(...messages: unknown[]) {
    this.logMessage("info", messages);
  }

  debug(...message: unknown[]) {
    this.logMessage("debug", message);
  }

  error(...message: unknown[]) {
    this.logMessage("error", message);
  }

  warn(...message: unknown[]) {
    this.logMessage("warn", message);
  }

  fatal(...message: unknown[]) {
    this.logMessage("fatal", message);
    return new Error(message.join(" "));
  }
}
