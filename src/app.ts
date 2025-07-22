import express, {
  ErrorRequestHandler,
  json,
  NextFunction,
  Request,
  Response,
} from "express";
import { normalizePort } from "./utils";
import authRouter from "./api/auth";
import tasksRouter from "./api/tasks";
import userRouter from "./api/user";

const app = express();
const host = process.env.APP_PORT ? "0.0.0.0" : "127.0.0.1";

app.use(json());
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log("incoming request");
  next();
});

app.use("/api/auth", authRouter);
app.use("/api/tasks", tasksRouter);
app.use('api/users', userRouter);

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err) {
    console.error(`Error occur: ${err}`);
    res.sendStatus(500);
  }
};
app.use(errorHandler);

app.listen(8080, host, () => {
  console.log(`todocalender app listening on host ${host} port 8080}`);
});
