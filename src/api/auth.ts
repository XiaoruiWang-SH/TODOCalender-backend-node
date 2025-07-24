import { Router } from "express";
import User from "../model/userModel";
import {
  isError,
  validateRegisterBody,
  validateLoginBody,
  log,
  type MyResponse,
  formatRes,
} from "../utils";
import {
  sign,
  verify,
  VerifyCallback,
} from "jsonwebtoken";

const router = Router();
export const secretKey = process.env.JWT_SECRET || "xiaoruiwangJsonwebtokenSecretKey";

router.use((req, res, next) => {
  console.log("进入了auth路由"); 
  next();
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
  const plain = user.toPlain();
  // generate jwt
  sign(plain, secretKey, { expiresIn: 86400 }, async (err, token) => {
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
    res.json(formatRes(true, "register successful", user.toInfo()));
  });
});

router.post("/login", async (req, res, next) => {
  try {
    const isValidBody = validateLoginBody(req.body);
  } catch (error) {
    return next(error);
  }
  const users = await User.queryUser(req.body.email);
  if (users.length === 0) {
    return next(new Error("The user is not existed, please register first."));
  }
  if (users.length !== 1) {
    return next(new Error("Internal error."));
  }
  const user = User.from(users[0]);
  const plain = user.toPlain();
  // generate jwt
  sign(plain, secretKey, { expiresIn: 86400 }, async (err, token) => {
    if (err) {
      return next(err);
    }
    log(`generated token is: ${token}`);

    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 86400 * 1000),
      httpOnly: true,
      secure: true,
    });
    res.json(formatRes(true, "login successful", user.toInfo()));
  });

  //   const jwt = req.cookies.jwt;
  //   if (!jwt) {
  //     return next(new Error("The user is not existed, please register first."));
  //   }
  //   const verifyCallback: VerifyCallback = (err, decoded) => {
  //     if (err) {
  //       return next(err);
  //     }
  //     // const obj = JSON.parse(decoded);
  //   };
  //   verify(jwt, secretKey, verifyCallback);
});

// router.get("/user", (req, res, next) => {
//   res.send("user");
// });

export default router;
