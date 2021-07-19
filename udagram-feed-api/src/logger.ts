import { createLogger, format, transports } from 'winston'

const { combine, timestamp, printf } = format

const customFormat = combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    printf(({ level, message, label, timestamp, correlationId }) => {
        return `${timestamp} ${level} - ${correlationId}: ${label} \n ${message}`;
    })
);

const logger = createLogger({
    level: 'info',
    transports: [new transports.Console()],
    format: customFormat
});

export default logger;