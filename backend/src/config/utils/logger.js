import winston from "winston";
import config from "../config.js";

const createLogger = (mode) => {
  const transports = [];

  if (mode === "DEVELOPMENT") {
    // Consola: Maneja todos los niveles en desarrollo
    transports.push(
      new winston.transports.Console({
        level: "debug",
        format: winston.format.combine(
          winston.format.colorize({ all: true }),
          winston.format.timestamp(),
          winston.format.printf(({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`)
        ),
      })
    );
    transports.push(
      new winston.transports.File({
        filename: "./errors.log",
        level: "warn",
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json()
        ),
      })
    );
  } else if (mode === "PRODUCTION") {
    // Archivo: Maneja los niveles "warn" y superiores en producción
    transports.push(
      new winston.transports.File({
        filename: "./errors.log",
        level: "warn",
        format: winston.format.combine(
          winston.format.timestamp(),
          winston.format.json()
        ),
      })
    );
  }

  return winston.createLogger({
    level: "debug", // Nivel mínimo permitido
    transports,
  });
};

const logger = createLogger(config.mode);
logger.info(`CONFIG MODE: ${config.mode}`);

export default logger;