import express, {
  ErrorRequestHandler,
  json,
  NextFunction,
  Request,
  Response,
} from "express";

const app = express();
const port = normalizePort(process.env.APP_PORT || "3000");

function normalizePort(val: string): number {
  const port: number = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return port;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return 0;
}

app.use(json());
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log("incoming request");
  next();
});

app.get("/", (req: Request, res: Response) => {
  res.send("hello world");
});

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err) {
    console.error(`Error occur: ${err}`);
  }
  console.error('not found');
  res.sendStatus(500);
};
app.use(errorHandler);

app.listen(8080, "0.0.0.0", () => {
  console.log(`todocalender app listening on port ${port}`);
});
