import express, { Express, Router } from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import hpp from "hpp";
import compression from "compression";
import { corsOptions } from "@config/cors.config";
import { apiRateLimiter } from "@middleware/rate-limiter.middleware";
import { ErrorMiddleware } from "@middleware/error.middleware";
import { ResponseModifier } from "@middleware/response-modifier.middleware";
import { NotFoundMiddleware } from "@middleware/not-found.middleware";
import { PORT } from "@config/app.config";
import router from "@routes/index";

class App {
  private app: Express;
  public server: any;

  constructor() {
    this.app = express();
    this.initializeMiddleware();
    this.initializeRateLimiter();
    this.initializeResponseModifierMiddleware();
    this.initializeRoutes(router);
    this.initializeNotFoundMiddleware();
    this.initializeErrorMiddleware();
  }

  public initializeMiddleware(): void {
    this.app.use(morgan("combined"));
    this.app.use(helmet());
    this.app.use(cors(corsOptions));
    this.app.use(express.json());
    this.app.use(cookieParser());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(hpp());
    this.app.use(compression());
  }

  public initializeRateLimiter(): void {
    this.app.use(apiRateLimiter);
  }

  public initializeRoutes(routes: Router): void {
    this.app.use("/api", routes);
  }

  public initializeResponseModifierMiddleware(): void {
    this.app.use(ResponseModifier);
  }

  public initializeNotFoundMiddleware(): void {
    this.app.use(NotFoundMiddleware);
  }

  public initializeErrorMiddleware(): void {
    this.app.use(ErrorMiddleware);
  }

  public initiallizeServer(): any {
    this.server = this.app.listen(PORT, () => {
      console.log(`server listening on ${PORT}`);
    });
    return this.server
  }

  public getApp(): Express {
    return this.app;
  }
}

export default App;
