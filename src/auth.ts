import { Router } from "express";

const router = Router();

router.get("/", (req, res, next) => {
  res.send("auth");
});

router.post("/register", (req, res, next) => {
//   res.send("user");
});

// router.get("/login", (req, res, next) => {
//   res.send("user");
// });

// router.get("/user", (req, res, next) => {
//   res.send("user");
// });

export default router;