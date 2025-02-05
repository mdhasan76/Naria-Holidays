import { createLogger, format, transports } from "winston";
const { combine, timestamp, label, printf } = format;

// Custom Log format

// const googleLoggingWinston = new LoggingWinston({
//   projectId: 'standard-os',
//   keyFilename: './standard-os-f4b9ce795d02.json',
//   // Replace with the path to your service account JSON file
// })

const myFormat = printf(({ level, message, label, timestamp }) => {
  const date = new Date(timestamp as any).toDateString();
  const hour = new Date(timestamp as any).getHours();
  const minutes = new Date(timestamp as any).getMinutes();
  const seconds = new Date(timestamp as any).getSeconds();
  const time = `${hour}:${minutes}:${seconds}`;
  return `${date} | ${time} [${label}] ${level}: ${message}`;
});

const successLogger = createLogger({
  level: "info",
  format: combine(label({ label: "Success Log" }), timestamp(), myFormat),
  transports: [
    new transports.Console(),
    // googleLoggingWinston, // Add the Google Cloud LoggingWinston transport
  ],
});

const errorLogger = createLogger({
  level: "error",
  format: combine(label({ label: "Error Log" }), timestamp(), myFormat),
  transports: [new transports.Console()],
});

export { successLogger, errorLogger };
