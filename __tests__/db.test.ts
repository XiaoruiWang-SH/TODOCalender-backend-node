import {
  createTables,
  type tableInitializationProps,
  deleteTable,
  insertUser,
} from "../src/data/db";
import mysql from "mysql2/promise";
import { UserItem } from "../src/model/userModel";

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
    userTable: "userTableTest",
    calendarTable: "calendarTableTest",
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
    const result = await insertUser(aUser, pool, userTable);
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
      await insertUser(aUser, pool, userTable);
    } catch (error) {
      expect(error).not.toBeNull();
    } 
  });
  test("insert a invalid user record", async () => {
    const aUser: UserItem = {
      id: 100,
      name: "wangxiaoer",
      email: "wangxiaoer@qq.com",
      password: 123 as unknown as string,
      role: "user",
      provider: "google",
      providerId: null,
    };
    try {
      await insertUser(aUser, pool, userTable);
    } catch (error) {
      expect(error).not.toBeNull();
    } 
  });
});
