import {
  createTables,
  type tableInitializationProps,
  deleteTable,
} from "../src/data/db";
import mysql from "mysql2/promise";

const host = "127.0.0.1";
const user = "root";
const password = "root";
const dbName = "todocalendar_test";
const userTable = "userTableTest";
const calendarTable = "calendarTableTest";

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
  return;
});

describe("check table creation", () => {
  it("user table creation", async () => {
    const conn = await mysql.createConnection({
      host,
      user,
      password,
      database: dbName,
    });
    const [rows] = await conn.query(`SHOW TABLES LIKE ?`, ["userTableTest"]);
    expect((rows as any).length).toBeGreaterThan(0);
    await conn.end();
  });
});
