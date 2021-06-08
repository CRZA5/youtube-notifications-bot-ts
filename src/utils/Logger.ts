/**
 * Source https://github.com/zihadmahiuddin/sharedsharder/blob/master/src/lib/util/Logger.ts
 */

import { inspect } from "util";
import leeks from "leeks.js";

type LogMessage = (string | object | any[])[];
enum LogLevel {
  INFO,
  WARN,
  ERROR,
  DEBUG,
}

enum LogSeverity {
  NONE,
  ERROR,
}

export default class Logger {
  public colors: typeof leeks.colors = leeks.colors;

  constructor(private tag?: string) {}

  private getDate() {
    const now = new Date();

    const seconds = `0${now.getSeconds()}`.slice(-2);
    const minutes = `0${now.getMinutes()}`.slice(-2);
    const hours = `0${now.getHours()}`.slice(-2);
    const ampm = now.getHours() >= 12 ? "PM" : "AM";

    return `[${hours}:${minutes}:${seconds} ${ampm}]`;
  }

  private write(
    level: LogLevel,
    severity: LogSeverity,
    ...message: LogMessage
  ) {
    let lvlText!: string;
    switch (level) {
      case LogLevel.INFO:
        {
          lvlText = this.colors.cyan(`[INFO/${process.pid}]`);
        }
        break;

      case LogLevel.WARN:
        {
          lvlText = this.colors.yellow(`[WARN/${process.pid}]`);
        }
        break;

      case LogLevel.ERROR:
        {
          lvlText = this.colors.red(`[ERROR/${process.pid}]`);
        }
        break;

      case LogLevel.DEBUG:
        {
          lvlText = leeks.hex("#987DC5", `[DEBUG/${process.pid}]`);
        }

        break;
    }

    if (this.tag?.length) {
      lvlText += ` [${this.tag}]`;
    }

    const msg = message
      .map((m) =>
        m instanceof Array
          ? `[${m.join(", ")}]`
          : m instanceof Object
          ? inspect(m)
          : (m as string)
      )
      .join("\n");

    const print = severity === LogSeverity.ERROR ? console.error : console.log;
    print(`${this.colors.gray(this.getDate())} ${lvlText} => ${msg}`);
  }

  info(...message: LogMessage) {
    this.write(LogLevel.INFO, LogSeverity.NONE, ...message);
  }

  warn(...message: LogMessage) {
    this.write(LogLevel.WARN, LogSeverity.NONE, ...message);
  }

  error(...message: LogMessage) {
    this.write(LogLevel.ERROR, LogSeverity.ERROR, ...message);
  }

  debug(...message: LogMessage) {
    if (process.env.NODE_ENV !== "development") return;

    this.write(LogLevel.DEBUG, LogSeverity.NONE, ...message);
  }
}
