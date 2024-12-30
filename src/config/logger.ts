import winston, { format } from 'winston';
import 'winston-daily-rotate-file';


const createLogger = () => {
  return winston.createLogger({
    format: format.combine(format.timestamp(), format.simple()),
    transports: [
      new winston.transports.File({
        filename: 'logfiles/logs.log',
        level: 'error',
        handleExceptions: true,
      }),
      new winston.transports.File({
        filename: 'logfiles/logs.log',
        level: 'info',
        handleExceptions: true,
      }),
      new winston.transports.DailyRotateFile({
        maxFiles: '14d',
        level: 'info',
        dirname: 'logfiles',
        datePattern: 'YYYY-MM-DD',
        filename: 'logs.log',
      }),
      new winston.transports.Console({
        level: 'debug',
        handleExceptions: true,
      }),
    ],
  });
};


const createMorganLogger = () => {
  return winston.createLogger({
    format: format.combine(format.simple()),
    transports: [
      new winston.transports.File({
        filename: 'logfiles/logs.log',
        level: 'debug',
        handleExceptions: true,
      }),
      new winston.transports.Console({
        level: 'debug',
        handleExceptions: true,
      }),
      new winston.transports.DailyRotateFile({
        maxFiles: '14d',
        level: 'info',
        dirname: 'logfiles',
        datePattern: 'YYYY-MM-DD',
        filename: 'logs.log',
      }),
    ],
  });
};


const logStream = (message:any): void => {
  const morganLogger = createMorganLogger();
  morganLogger.info(message.toString());
};

export { createLogger, logStream };
