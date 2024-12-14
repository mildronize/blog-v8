import pino from 'pino';

export interface Logger {
  info(message: string): void;
  debug(message: string): void;
  error(message: string): void;
  warn(message: string): void;
}

export class ConsoleLogger implements Logger {
  constructor(public readonly verbose: boolean = false) {
  }
  info(message: string) {
    console.info(message);
  }
  debug(message: string) {
    if (this.verbose) console.debug(message);
  }
  error(message: string) {
    console.error(message);
  }
  warn(message: string) {
    console.warn(message);
  }
}

// ----------------------------
// pino logger
// ----------------------------

export class PinoLogger implements Logger {
  constructor(private logger: pino.Logger) { }

  info(message: string) {
    this.logger.info(message);
  }
  debug(message: string) {
    this.logger.debug(message);
  }
  error(message: string) {
    this.logger.error(message);
  }
  warn(message: string) {
    this.logger.warn(message);
  }
}

export const pinoLogBuilder = (name: string, level: pino.LevelWithSilentOrString) => {
  return pino({
    level,
    name,
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true
      }
    }
  });
}