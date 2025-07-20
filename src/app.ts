import express, { ErrorRequestHandler, json, Request, Response } from "express";

const app = express();
const port = 3000;

app.use(json());

app.get("/", (req: Request, res: Response) => {
  res.send("hello world");
});

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err) {
    console.error(`Error occur: ${err}`);
  }
  next();
};
app.use(errorHandler);

app.listen(port, () => {
  console.log(`todocalender app listening on port ${port}`);
});
