
class Debug {
  private m: string;
  constructor(m: string) {
    this.m = m;
  }
  public debug(str: string) {
    const debug = 'debug: ';
    if (!process.env.production) {
        console.log(debug + new Date().toISOString() + ' ' + this.m + ' ' + str);
    }

  }
}
  // let v: winston.LoggerOptions;
// if we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
// if (process.env.NODE_ENV !== 'production') {
// logger.add(new winston.transports.Console({
//     format: winston.configure({

//     })
// }));
// }
export const log = new Debug('[iTemper-web]');
