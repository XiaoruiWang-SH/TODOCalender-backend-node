import { Router } from "express";

const router = Router();

router.use((req, res, next) => {
  console.log("进入user路由");
  next();
});

export default router;



