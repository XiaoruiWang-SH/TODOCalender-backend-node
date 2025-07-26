import { Router } from "express";
import { Task, TaskItem } from "../model/taskModel";
import { formatRes, log } from "../utils";

const router = Router();

router.use((req, res, next) => {
  log("进入tasks路由");
  next();
});

router.post("/all", async (req, res, next) => {
  const { date, startDate, endDate } = req.body;
  if (!date) {
    next(new Error("Date param is empty"));
    return;
  }
  const userInfo = req.app.get("userInfo");
  const email = userInfo.email;
  try {
    const result = await Task.findAllTasks(date, email);
    res.json(
      formatRes(
        true,
        "query successful",
        result.map((task) => task.toPlain())
      )
    );
  } catch (err) {
    throw err;
  }
});

router.post("/create", async (req, res, next) => {
  const {
    title,
    details,
    checked,
    important,
    createTime,
    expireTime,
    updateTime,
    createDate,
  } = req.body;
  const userInfo = req.app.get("userInfo");
  const email = userInfo.email;
  const taskItem: TaskItem = {
    id: 0,
    title,
    details,
    checked,
    important,
    createTime,
    expireTime,
    updateTime,
    createDate,
    userName: email,
  };
  try {
    const result = await Task.addTask(taskItem);
    if (result > 0) {
      res.json(formatRes(true, "add successful", result));
    } else {
      return next(new Error("add task failed"));
    }
  } catch (error) {
    throw error;
  }
});

router.post("/update/:id", async (req, res, next) => {
  const id = req.params.id;
  const {
    title,
    details,
    checked,
    important,
    createTime,
    expireTime,
    updateTime,
    createDate,
  } = req.body;
  const userInfo = req.app.get("userInfo");
  const email = userInfo.email;
  const taskItem: TaskItem = {
    id: parseInt(id),
    title,
    details,
    checked,
    important,
    createTime,
    expireTime,
    updateTime,
    createDate,
    userName: email,
  };
  try {
    const result = await Task.updateTask(taskItem);
    res.json(formatRes(true, "update successful", result));
  } catch (err) {
    throw err;
  }
});

router.post("/delete/:id", async (req, res, next) => {
  const id = req.params.id;
  try {
    const result = Task.deleteTask(parseInt(id));
    res.json(formatRes(true, "delete successful", result));
  } catch (err) {
    throw err;
  }
});

export default router;
