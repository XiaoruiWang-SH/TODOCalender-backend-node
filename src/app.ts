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
  shouldFilter,
} from "./utils";
import authRouter, { validateToken } from "./api/auth";
import tasksRouter from "./api/tasks";
import userRouter from "./api/user";
import oauthRouter from "./api/oauth";
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
    log("incoming request: " + req.path);
    // filter urls
    if (shouldFilter(req.path)) {
      next();
    } else {
      // validate token
      validateToken(req, res, next);
    }
  });

  app.use("/api/oauth2", oauthRouter);
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

export const dbName = process.env.MYSQL_DATABASE || "todocalendar_dev";
export const userTable = "users";
export const calendarTable = "calendar";
export const host = process.env.MYSQL_HOST || "localhost";
export const dbInitializationUser = process.env.MYSQL_ROOT_USER || "root";
export const dbInitializationPassword =
  process.env.MYSQL_ROOT_PASSWORD || "root";
export const tableInitializationUser = process.env.MYSQL_USER || "user";
export const tableInitializationPassword = process.env.MYSQL_PASSWORD || "user";

async function bootstrap() {
  try {
    const dbInitializationParams = {
      dbName,
      host,
      user: dbInitializationUser,
      password: dbInitializationPassword,
      grantedUser: tableInitializationUser,
    };
    const tableInitializationParams = {
      userTable,
      calendarTable,
      dbName,
      host,
      user: tableInitializationUser,
      password: tableInitializationPassword,
    };
    await initDB(dbInitializationParams);
    await createTables(tableInitializationParams);
    await startServer();
  } catch (err) {
    console.error("❌ Startup failed:", err);
    process.exit(1);
  }
}

bootstrap();
