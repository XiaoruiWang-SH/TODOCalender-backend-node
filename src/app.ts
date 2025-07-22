import express, {
  ErrorRequestHandler,
  json,
  NextFunction,
  Request,
  Response,
} from "express";
import { normalizePort } from "./utils";
import authRouter from "./auth";
import tasksRouter from "./tasks";
import userRouter from "./user";

const app = express();
const port = normalizePort(process.env.APP_PORT || "3000");

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

app.listen(8080, "0.0.0.0", () => {
  console.log(`todocalender app listening on port ${port}`);
});
