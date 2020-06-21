import { config } from '@/config';
class Debug {
  private logging: boolean = config.development;
  private m: string;
  constructor(m: string) {
    this.m = m;
  }
  public debug(str: string) {
    const debug = 'debug: ';
    if (this.logging) {
        console.log(debug + new Date().toISOString() + ' ' + this.m + ' ' + str);
    }

  }
  public startLogging(): void {
    this.logging = true;
    this.debug('debug.start');
    this.setTimer();
  }

  public stopLogging(): void {
    this.logging = false;

  }
  private reset(): void {
    this.debug('debug.reset');
    this.logging = config.development;
  }

  private setTimer() {
    const timeout = 5 * 60_000;
    setTimeout(() => {this.reset(); }, timeout);
  }

}

export const log = new Debug('[iTemper-web]');
