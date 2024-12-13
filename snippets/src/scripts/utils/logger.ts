export class Logger {
  constructor(public readonly verbose: boolean = false) {
  }
  log(message: string) {
    if (this.verbose) console.log(message);
  }
  error(message: string) {
    console.error(message);
  }
  warn(message: string) {
    console.warn(message);
  }
}