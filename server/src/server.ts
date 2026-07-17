import "@config/app.config";
import App from "./app";

const app = new App();
const server = app.initiallizeServer();

const gracefulShutdown = (signal: string): void => {
  console.info(`${signal} received. Shutting down gracefully...`);
  server.close(() => {
    console.info("Server closed.");
    process.exit(0);
  });
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

process.on("unhandledRejection", (reason: unknown) => {
  console.error("Unhandled Rejection:", reason);
  server.close(() => process.exit(1));
});

process.on("uncaughtException", (error: Error) => {
  console.error("Uncaught Exception:", error);
  server.close(() => process.exit(1));
});
