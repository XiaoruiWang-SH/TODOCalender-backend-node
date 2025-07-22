import { Router } from "express";
import User from "../model/userModel";
import { isError, validateBody } from "../utils";

const router = Router();

router.get("/", (req, res, next) => {
  res.send("auth");
});

router.post("/register", (req, res, next) => {
  try {
    const isValidBody = validateBody(req.body);
  } catch (error) {
    if (isError(error)) {
      res.status(500).json({ error: error.message });
    } else {
      res.sendStatus(500);
    }
    return;
  }

  const user = User.from(req.body);
  console.log(`user: ${JSON.stringify(user)}`);
  res.send("user");
});

// router.get("/login", (req, res, next) => {
//   res.send("user");
// });

// router.get("/user", (req, res, next) => {
//   res.send("user");
// });

export default router;
