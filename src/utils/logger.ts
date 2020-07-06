import {createLogger, format, transports} from 'winston';
import path from 'path';

const logLevel:string = process.env.LOGGING_LEVEL || 'debug';
const logDir:string = process.env.LOG_DIRECTORY || 'log';
const filename:string = path.join(logDir, 'results.log');

const logConfig = {
  file: {
    level: logLevel,
    format: format.combine(
      format.timestamp({
        format:'YYYY-MM-DD HH:mm:ss'
      }),
      format.splat(), 
      format.json()
    ),
    filename
},
console: {
  level: 'info',
  format: format.combine(
    format.timestamp({
      format:'YYYY-MM-DD HH:mm:ss'
    }),
    format.colorize(),
    format.simple(),
    ),
  }
}

export const logger = createLogger({
  transports: [
      new transports.File(logConfig.file),
      new transports.Console(logConfig.console)
  ],
  exitOnError: false
});