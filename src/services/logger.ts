
class Debug {
  private log: boolean = !process.env.production;
  private m: string;
  constructor(m: string) {
    this.m = m;
  }
  public debug(str: string) {
    const debug = 'debug: ';
    if (this.log) {
        console.log(debug + new Date().toISOString() + ' ' + this.m + ' ' + str);
    }

  }
  public startLogging(): void {
    this.log = true;
    this.debug('debug.start');
    this.setTimer();
  }

  public stopLogging(): void {
    this.log = false;

  }
  private reset(): void {
    this.debug('debug.reset');
    this.log = !process.env.production;
  }

  private setTimer() {
    const timeout = 60_000;
    setTimeout(() => {this.reset(); }, timeout);
  }

}

export const log = new Debug('[iTemper-web]');
