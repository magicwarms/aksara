import { createLogger, transports, format } from "winston";
const { combine, timestamp, prettyPrint, printf } = format;

import path from "path";

const myFormat = printf(({ message, timestamp }) => {
    return `${timestamp} - ${message}`;
});

// Debugging purpose with winston
const logger = createLogger({
    level: "info",
    format: combine(format.json({ space: 2 }), timestamp(), myFormat, prettyPrint()),
    transports: [
        // Write all logs with level `error` and below to `error.log`
        new transports.File({
            filename: path.join(__dirname, "../logs/errors.log"),
            level: "error",
        }),
    ],
});

export default logger;
