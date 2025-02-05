import { Server } from "http";
import app from "./app";
import { config } from "./config";
import { errorLogger, successLogger } from "./shared/logger";
import { connectDatabase } from "./server.utils/DBConnections";

async function startServer() {
  let server: Server;

  function handleProcessErrors(error: any) {
    if (server) {
      server.close(() => {
        errorLogger.error(error);
        process.exit(1);
      });
    } else {
      errorLogger.error(error);
      process.exit(1);
    }
  }

  function handleGracefulShutdown(server: Server) {
    if (server) {
      server.close(() => {
        successLogger.info("Server gracefully shut down");
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  }
  function handleSIGTERM(server: Server) {
    if (server) {
      if (config.env == "production") {
        server.close(() => {
          successLogger.info("Process terminated");
        });
      }
    }
  }

  // process.on('uncaughtException', handleProcessErrors)
  // process.on('unhandledRejection', handleProcessErrors)
  // process.on('SIGINT', () => handleGracefulShutdown(server))
  // process.on('SIGTERM', () => handleSIGTERM(server))

  async function startListening() {
    server = app.listen(config.port, () => {
      successLogger.info(`Server is listening on port ${config.port}`);
    });
  }

  await connectDatabase();
  await startListening();
}

startServer();
