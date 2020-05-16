
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
  private reset(): void {
    this.debug('debug.reset');
    this.log = !process.env.production;
  }

  private setTimer() {
    const timeout = 30_000;
    setTimeout(() => {this.reset(); }, timeout);
  }

}

export const log = new Debug('[iTemper-web]');
