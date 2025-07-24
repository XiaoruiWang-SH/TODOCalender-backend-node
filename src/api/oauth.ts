import { Router } from "express";
import axios from "axios";
import { sign } from "jsonwebtoken";
import { secretKey } from "./auth";
import { log } from "../utils";
import User from "../model/userModel";

const router = Router();

router.use((req, res, next) => {
  console.log("进入了oauth路由");
  next();
});

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
const google_client_id = process.env.GOOGLE_CLIENT_ID || "GOOGLE_CLIENT_ID";
const google_client_secret =
  process.env.GOOGLE_CLIENT_SECRET || "GOOGLE_CLIENT_SECRET";

router.get("/authorize/google", (req, res, next) => {
  const redirect_uri = "http://localhost:8081/api/oauth2/callback/google";
  const client_id = google_client_id;
  const scope = "profile email";
  const state = crypto.randomUUID(); // 用于 CSRF 防护

  const authUrl =
    `https://accounts.google.com/o/oauth2/v2/auth?` +
    `client_id=${client_id}&redirect_uri=${encodeURIComponent(redirect_uri)}` +
    `&response_type=code&scope=${encodeURIComponent(scope)}&state=${state}`;

  res.redirect(authUrl);
});

router.get("/callback/google", async (req, res, next) => {
  const code = req.query.code;
  const redirect_uri = "http://localhost:8081/api/oauth2/callback/google";
  const tokenRes = await axios.post(
    "https://oauth2.googleapis.com/token",
    null,
    {
      params: {
        code,
        client_id: google_client_id,
        client_secret: google_client_secret,
        redirect_uri,
        grant_type: "authorization_code",
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  const { access_token, expires_in, id_token, scope, token_type } =
    tokenRes.data;

  // 🔐 获取用户信息
  const userInfoRes = await axios.get(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );

  const { email, name, picture } = userInfoRes.data; // 包含 email, name, picture 等

  const userinfo = {
    name: name,
    email: email,
    password: "password",
    role: "user",
    provider: "google",
    providerId: "google",
  };
  // generate jwt
  sign(userinfo, secretKey, { expiresIn: 86400 }, async (err, token) => {
    if (err) {
      return next(err);
    }
    log(`generated token is: ${token}`);

    const users = await User.queryUser(email);
    if (users.length === 0) {
      // doesn't exist in db, need to register first
      let insertId = 0;
      try {
        const user = User.from(Object.assign({ id: 0 }, userinfo));
        insertId = await user.register(); // insert a user to user table
        log(`insert successfly, insertId is ${insertId}`);
      } catch (error) {
        return next(error);
      }
      if (insertId < 0) {
        return next(new Error("Failed to insert a user"));
      }
    }
    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 86400 * 1000),
      httpOnly: true,
      secure: true,
    });
    // res.json(formatRes(true, "register successful", user.toInfo()));
    const frontend_redirect_url =
      frontendUrl +
      "?auth=success" +
      "&name=" +
      userinfo.name +
      "&email=" +
      userinfo.email +
      "&role=" +
      userinfo.role;
    res.redirect(frontend_redirect_url);
  });
});

export default router;
