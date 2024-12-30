import { Logger } from "./logger";

export class ConsoleLogger implements Logger {
  constructor(public readonly verbose: boolean = false) {
  }
  info(...messages: string[]) {
    console.info(messages);
  }
  debug(...messages: string[]) {
    if (this.verbose) console.debug(...messages);
  }
  error(...messages: string[]) {
    console.error(...messages);
  }
  warn(...messages: string[]) {
    console.warn(...messages);
  }
  fatal(...messages: string[]) {
    console.error(...messages);
    return new Error(messages.join(" "));
  } 
}
