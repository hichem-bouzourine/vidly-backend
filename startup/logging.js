const winston = require("winston");
const { format, transports } = require("winston");
const { combine, timestamp, printf } = format;
require("winston-mongodb");
require("express-async-errors");

const myFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} ${level}: ${stack || message}`;
});

const logger = winston.createLogger({
  level: "info",
  format: combine(
    format.json(),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    myFormat,
    format.errors({ stack: true })
  ),
  defaultMeta: { service: "user-service" },
  transports: [
    new transports.Console(),
    new winston.transports.File({
      filename: "logfile.log",
    }),
    // new winston.transports.MongoDB({
    //   db: "mongodb://localhost/vidly",
    // }),
  ],
  exceptionHandlers: [
    new transports.File({
      filename: "uncaughtException.log",
      handleRejections: false,
    }),
  ],
  rejectionHandlers: [
    new transports.File({
      filename: "uncaughtRejections.log",
      handleExceptions: true,
    }),
  ],
});

module.exports = logger;
