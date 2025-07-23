import { Router } from "express";
import User from "../model/userModel";
import {
  isError,
  validateRegisterBody,
  validateLoginBody,
  log,
} from "../utils";
import {
  JsonWebTokenError,
  JwtPayload,
  sign,
  verify,
  VerifyCallback,
} from "jsonwebtoken";

const router = Router();
const secretKey = process.env.JWT_SECRET || "xiaoruiwangJsonwebtokenSecretKey";

router.get("/", (req, res, next) => {
  res.send("auth");
});

router.post("/register", async (req, res, next) => {
  try {
    const isValidBody = validateRegisterBody(req.body);
  } catch (error) {
    return next(error);
  }

  const user = User.from(req.body);
  log(`user: ${JSON.stringify(user)}`);
  const isExist = await user.checkIfExist();
  if (isExist) {
    return next(new Error("email has already existed"));
  }

  // generate jwt
  sign(req.body, secretKey, { expiresIn: 86400 }, async (err, token) => {
    if (err) {
      return next(err);
    }
    log(`generated token is: ${token}`);

    let insertId = 0;
    try {
      insertId = await user.register(); // insert a user to user table
      log(`insert successfly, insertId is ${insertId}`);
    } catch (error) {
      return next(error);
    }
    if (insertId < 0) {
      return next(new Error("Failed to insert a user"));
    }
    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 86400 * 1000),
      httpOnly: true,
      secure: true,
    });
    res.json({ message: "register successful" });
  });
});

router.get("/login", (req, res, next) => {
  try {
    const isValidBody = validateRegisterBody(req.body);
  } catch (error) {
    return next(error);
  }
  const jwt = req.cookies.jwt;
  if (!jwt) {
    return next(new Error("The user is not existed, please register first."));
  }
  const verifyCallback: VerifyCallback = (err, decoded) => {
    if (err) {
      return next(err);
    }
    // const obj = JSON.parse(decoded);
  };
  verify(jwt, secretKey, verifyCallback);
});

// router.get("/user", (req, res, next) => {
//   res.send("user");
// });

export default router;
