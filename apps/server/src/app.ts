import compression from "compression"; // Import the compression package
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import helmet from "helmet";

import httpStatus from "http-status";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import routes from "./app/routes";

const corsOptions = {
  origin: ["http://localhost:3000", "https://naria-holidays.netlify.app"],
  credentials: true,
};

const app: Application = express();

// Middleware setup
setupMiddleware();

// Routes setup
app.get("/", initialRoute);
app.use("/api/v1", routes);

// Custom Not Found handler
app.use(notFoundHandler);

// Global error handler
app.use(globalErrorHandler);

// Middleware setup function
function setupMiddleware() {
  const middlewares = [
    cors(corsOptions),
    cookieParser(),
    helmet(),
    express.json(),
    express.urlencoded({ extended: true }),
    compression(),
  ];

  middlewares.forEach((middleware) => {
    app.use(middleware);
  });
}

// Welcome route handler
function initialRoute(req: Request, res: Response) {
  res.json({
    statusCode: httpStatus.OK,
    success: true,
    message: "Welcome to Naria Holidays v1",
  });
}

// Custom Not Found handler
function notFoundHandler(req: Request, res: Response) {
  const errorMessage = `No API endpoint found for ${req.method} ${req.originalUrl}`;
  res.status(httpStatus.NOT_FOUND).json({
    status: "false",
    message: errorMessage,
    errorMessages: [{ message: errorMessage, path: req.originalUrl }],
    stack: "",
  });
}

app.set("trust proxy", true);
export default app;
