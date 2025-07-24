import { NextFunction, RequestHandler, Response, Router } from "express";
import User from "../model/userModel";
import {
  isError,
  validateRegisterBody,
  validateLoginBody,
  log,
  type MyResponse,
  formatRes,
} from "../utils";
import { JwtPayload, sign, verify, VerifyCallback } from "jsonwebtoken";

const router = Router();
export const secretKey =
  process.env.JWT_SECRET || "xiaoruiwangJsonwebtokenSecretKey";

export const validateToken: RequestHandler = (req, res, next) => {
  const jwt = req.cookies.jwt;
  if (!jwt) {
    return next(new Error("The user is not existed, please register first."));
  }

  const isJwtPayload = (obj: any): obj is JwtPayload => {
    return typeof obj === "object" && obj !== null && "exp" in obj;
  };

  const verifyCallback: VerifyCallback = (err, decoded) => {
    if (err) {
      return next(err);
    }
    if (isJwtPayload(decoded)) {
      const { name, email, role } = decoded;
      req.app.set("userInfo", { name, email, role });
      next();
    } else {
      return next(new Error("Token is expired, please login"));
    }
  };
  verify(jwt, secretKey, verifyCallback);
};

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
});

router.get("/user", (req, res, next) => {
  const userInfo = req.app.get("userInfo");
  const validateUserinfo = (userinfo: any) => {
    if (
      typeof userinfo === "object" &&
      userinfo !== null &&
      "name" in userinfo &&
      "email" in userinfo &&
      "role" in userinfo
    ) {
      return true;
    }
    return false;
  };
  if (!validateUserinfo(userInfo)) {
    return next(new Error("Please login"));
  }
  res.json(
    formatRes(true, "login successful", {
      name: userInfo.name,
      email: userInfo.email,
      role: userInfo.role,
    })
  );
});

router.post("/logout", (req, res, next) => {
  res.cookie("jwt", "", {
    expires: new Date(Date.now()),
    httpOnly: true,
    secure: true,
  });
  req.app.set("userInfo", {});
  res.json(formatRes(true, "logout successful", {}));
});

export default router;
