import winston from 'winston'

const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`,
    )
);

const transports = [
    new winston.transports.Console()
];

const logger = winston.createLogger({
    level: 'info',
    transports: transports,
    format: format
});

export default logger;