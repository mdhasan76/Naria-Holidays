import { Server } from "http";
import app from "./app";
import { config } from "./config";
import { successLogger } from "./shared/logger";
import { connectDatabase } from "./server.utils/DBConnections";

async function startServer() {
  let server: Server;

  async function startListening() {
    server = app.listen(config.port, () => {
      successLogger.info(`the server is running on ${config.port} port`);
    });
  }

  await connectDatabase();
  await startListening();
}

startServer();
