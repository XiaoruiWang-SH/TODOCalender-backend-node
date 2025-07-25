import {
  createTables,
  type tableInitializationProps,
  deleteTable,
  insertUser,
  queryTaskByData,
  insertTask,
  type Task,
  updateTask,
} from "../src/data/db";
import mysql from "mysql2/promise";
import { UserItem } from "../src/model/userModel";
import moment from "moment";

const host = "127.0.0.1";
const user = "root";
const password = "root";
const dbName = "todocalendar_test";
const userTable = "userTableTest";
const calendarTable = "calendarTableTest";
const pool = mysql.createPool({
  host: host,
  user: user,
  password: password,
  database: dbName,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

beforeAll(async () => {
  const tableInitializationParams: tableInitializationProps = {
    userTable,
    calendarTable,
    dbName,
    host,
    user,
    password,
  };
  return await createTables(tableInitializationParams);
});

afterAll(async () => {
  const userTableParams = {
    dbName,
    host,
    user,
    password,
    tableName: userTable,
  };
  await deleteTable(userTableParams);

  const tasksTableParams = {
    dbName,
    host,
    user,
    password,
    tableName: calendarTable,
  };
  await deleteTable(tasksTableParams);
  await pool.end();
  return;
});

describe("check table creation", () => {
  test("user table creation", async () => {
    const conn = await mysql.createConnection({
      host,
      user,
      password,
      database: dbName,
    });
    const [rows] = await conn.query(`SHOW TABLES LIKE ?`, [userTable]);
    expect((rows as any).length).toBeGreaterThan(0);
    await conn.end();
  });
  test("calendar table creation", async () => {
    const conn = await mysql.createConnection({
      host,
      user,
      password,
      database: dbName,
    });
    const [rows] = await conn.query(`SHOW TABLES LIKE ?`, [calendarTable]);
    expect((rows as any).length).toBeGreaterThan(0);
    await conn.end();
  });
});

describe("test insert user", () => {
  test("insert a mormal user record", async () => {
    const aUser: UserItem = {
      id: 100,
      name: "wangxiaoer",
      email: "wangxiaoer@qq.com",
      password: "wangxiaoer123",
      role: "user",
      provider: "google",
      providerId: null,
    };
    const result = await insertUser(aUser, userTable, pool);
    expect(result.insertId).toBeGreaterThan(0);
  });
  test("insert a repeatitive user record", async () => {
    const aUser: UserItem = {
      id: 100,
      name: "wangxiaoer",
      email: "wangxiaoer@qq.com",
      password: "wangxiaoer123",
      role: "user",
      provider: "google",
      providerId: null,
    };
    try {
      await insertUser(aUser, userTable, pool);
    } catch (error) {
      expect(error).not.toBeNull();
    }
  });
  test("insert a invalid user record", async () => {
    const aUser: UserItem = {
      id: 100,
      name: "wangxiaoer",
      email: "wangxiaoer1@qq.com",
      password: 123 as unknown as string,
      role: "user",
      provider: "google",
      providerId: null,
    };
    try {
      await insertUser(aUser, userTable, pool);
    } catch (error) {
      expect(error).not.toBeNull();
    }
  });
});

describe("test insert and query tasks", () => {
  const userName = "zhangSan";
  const createTime = new Date(Date.now());
  const task = {
    id: 0,
    title: "a test task",
    details: "a test task's detail",
    checked: false,
    important: true,
    createTime: moment(createTime).format("YYYY-MM-DD HH:mm:ss"),
    expireTime: null,
    updateTime: moment(createTime).format("YYYY-MM-DD HH:mm:ss"),
    createDate: moment(createTime).format("YYYY-MM-DD"),
    userName: userName,
  };
  test("insert a task", async () => {
    const result = await insertTask(task, calendarTable, pool);
    console.log(`insertID:${result.insertId}`);
    expect(result.insertId).toBeGreaterThan(0);
    task.id = result.insertId;
  });
  test("query the task", async () => {
    const queryDate = moment(createTime).format("YYYY-MM-DD");
    const tasks = await queryTaskByData(
      queryDate,
      userName,
      calendarTable,
      pool
    );
    expect(tasks.length).toBeGreaterThan(0);
    // const queryTask = JSON.stringify(tasks[0]);
    // console.log(`task:${queryTask}`);
    expect(tasks[0].userName).toEqual(userName);
  });
  test("update task", async () => {
    task.title = "updated task title";
    const result = await updateTask(task, calendarTable, pool);
    console.log(`update task id: ${result.insertId}`);
    expect(result.affectedRows).toEqual(1);
  });
  test("query the task again", async () => {
    const queryDate = moment(createTime).format("YYYY-MM-DD");
    const tasks = await queryTaskByData(
      queryDate,
      userName,
      calendarTable,
      pool
    );
    expect(tasks.length).toBeGreaterThan(0);
    // const queryTask = JSON.stringify(tasks[0]);
    // console.log(`task:${queryTask}`);
    expect(tasks[0].title).toEqual("updated task title");
  });
});
