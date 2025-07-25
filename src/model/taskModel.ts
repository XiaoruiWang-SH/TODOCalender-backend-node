import {
  deleteTask,
  insertTask,
  queryTaskByDate,
  updateTask,
  type Task as TaskType,
} from "../data/db";
import User from "./userModel";

export interface TaskItem {
  id: number;
  title: string;
  details: string | null;
  checked: boolean;
  important: boolean;
  createTime: string;
  expireTime: string | null;
  updateTime: string;
  createDate: string;
  userName: string;
}

export class Task {
  id: number;
  title: string;
  details: string | null;
  checked: boolean;
  important: boolean;
  createTime: string;
  expireTime: string | null;
  updateTime: string;
  createDate: string;
  userName: string;

  constructor({
    id = 0,
    title,
    details = null,
    checked,
    important,
    createTime,
    expireTime = null,
    updateTime,
    createDate,
    userName,
  }: TaskItem) {
    this.id = id;
    this.title = title;
    this.details = details;
    this.checked = checked;
    this.important = important;
    this.createTime = createTime;
    this.expireTime = expireTime;
    this.updateTime = updateTime;
    this.createDate = createDate;
    this.userName = userName;
  }

  static from(taskItem: TaskItem): Task {
    return new Task(taskItem);
  }

  static async findAllTasks(date: string, userName: string) {
    try {
      const result: TaskType[] = await queryTaskByDate(date, userName);
      return result.map((task) => Task.from(task));
    } catch (error) {
      throw error;
    }
  }

  static async addTask(task: TaskItem) {
    try {
      const result = await insertTask(task);
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async updateTask(task: TaskItem) {
    try {
      const result = await updateTask(task);
      if (result.affectedRows === 1) {
        return true;
      }
      return false;
    } catch (err) {
      throw err;
    }
  }
    
  static async deleteTask(taskID: number) {
    try {
      const result = await deleteTask(taskID);
      if (result.affectedRows === 1) {
        return true;
      }
      return false;
    } catch (err) {
      throw err;
    }
  }

  toPlain() {
    return {
      id: this.id,
      title: this.title,
      details: this.details,
      checked: this.checked,
      important: this.important,
      createTime: this.createTime,
      expireTime: this.expireTime,
      updateTime: this.updateTime,
      createDate: this.createDate,
      userName: this.userName,
    };
  }
}
