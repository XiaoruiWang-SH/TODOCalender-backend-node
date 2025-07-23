import express, {
  ErrorRequestHandler,
  json,
  NextFunction,
  Request,
  Response,
} from "express";
import {
  normalizePort,
  log,
  isError,
  type MyResponse,
  formatRes,
} from "./utils";
import authRouter from "./api/auth";
import tasksRouter from "./api/tasks";
import userRouter from "./api/user";
import { createTables, initDB } from "./data/db";
import cookieParser from "cookie-parser";
import cors from "cors";

async function startServer() {
  const app = express();
  const host = process.env.APP_PORT ? "0.0.0.0" : "127.0.0.1";

  app.use(
    cors({
      origin(requestOrigin, callback) {
        if (process.env.ENV === "dev") {
          callback(null, true);
        } else {
          callback(null, false);
        }
      },
      credentials: true,
    })
  );
  app.use(json());
  app.use(cookieParser());
  app.use((req: Request, res: Response, next: NextFunction) => {
    log("incoming request");
    next();
  });

  app.use("/api/auth", authRouter);
  app.use("/api/tasks", tasksRouter);
  app.use("/api/users", userRouter);

  app.use((req, res, next) => {
    console.log(`❓ Unmatched request: ${req.method} ${req.url}`);
    res.status(404).json({ error: "Not Found" });
  });

  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err) {
      if (isError(err)) {
        log(`Error occur: ${err}`);
        res.status(500).json(formatRes(false, err.message, {}));
      } else {
        res.sendStatus(500);
      }
    }
  });

  app.listen(8080, host, () => {
    log(`todocalender app listening on host ${host} port 8080}`);
  });
}

async function bootstrap() {
  try {
    await initDB();
    await createTables();
    await startServer();
  } catch (err) {
    console.error("❌ Startup failed:", err);
    process.exit(1);
  }
}

bootstrap();
