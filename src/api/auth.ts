import { Router } from "express";
import User from "../model/userModel";
import { isError, validateBody, log } from "../utils";

const router = Router();

router.get("/", (req, res, next) => {
  res.send("auth");
});

router.post("/register", async (req, res, next) => {
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
  log(`user: ${JSON.stringify(user)}`);
  const isExist = await user.checkIfExist();
  if (isExist) {
    res.status(500).json({ error: "email has already existed" });
    return;
  }

  const insertId = await user.register();
  log(`insert successfly, insertId is ${insertId}`);

  res.send("user");
});

// router.get("/login", (req, res, next) => {
//   res.send("user");
// });

// router.get("/user", (req, res, next) => {
//   res.send("user");
// });

export default router;
