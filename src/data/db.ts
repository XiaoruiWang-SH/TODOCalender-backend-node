import mysql, { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { log } from "../utils";
import { type UserItem } from "../model/userModel";

export interface dbInitializationProps {
  dbName: string;
  host: string;
  user: string;
  grantedUser: string;
  password: string;
}

export async function initDB({
  dbName,
  host,
  user,
  grantedUser,
  password,
}: dbInitializationProps) {
  // use root role to create db
  const conn = await mysql.createConnection({
    host: host,
    user: user,
    password: password,
  });
  try {
    const escapedDBName = mysql.escapeId(dbName);
    await conn.query(`CREATE DATABASE IF NOT EXISTS ${escapedDBName}`);
    log("✅ Database created");
    const escapedUserString = mysql.escape(grantedUser + "@%");
    // await conn.query(
    //   `
    // GRANT ALL PRIVILEGES ON ${escapedDBName}.* TO ${escapedUserString}`
    // );
    await conn.query(`
    GRANT ALL PRIVILEGES ON ${dbName}.* TO '${grantedUser}'@'%'
  `);
    log("✅ Privileges granted");

    await conn.query(`FLUSH PRIVILEGES`);
    log("✅ Privileges flushed");
  } catch (error) {
    throw error;
  } finally {
    await conn.end();
  }
}

export interface tableInitializationProps {
  userTable: string;
  calendarTable: string;
  dbName: string;
  host: string;
  user: string;
  password: string;
}

export async function createTables({
  userTable,
  calendarTable,
  dbName,
  host,
  user,
  password,
}: tableInitializationProps) {
  const conn = await mysql.createConnection({
    host: host,
    user: user,
    password: password,
    database: dbName,
  });
  await conn.query(`
    CREATE TABLE IF NOT EXISTS ${userTable} (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL,
        provider VARCHAR(255),
        providerId VARCHAR(255)
    );
        `);
  log("✅ User table created");

  await conn.query(`
    CREATE TABLE IF NOT EXISTS ${calendarTable} (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        details VARCHAR(255),
        checked BOOLEAN NOT NULL,
        important BOOLEAN NOT NULL,
        createTime DATETIME NOT NULL,
        expireTime DATETIME,
        updateTime DATETIME NOT NULL,
        createDate DATE NOT NULL,
        userName VARCHAR(255) NOT NULL
    );
        `);
  log("✅ Calendar table created");
  await conn.end();
}

export async function deleteTable({
  host,
  user,
  password,
  dbName,
  tableName,
}: {
  host: string;
  user: string;
  password: string;
  dbName: string;
  tableName: string;
}) {
  const conn = await mysql.createConnection({
    host,
    user,
    password,
    database: dbName,
  });

  try {
    const escapedTable = mysql.escapeId(tableName); // 防止SQL注入
    await conn.query(`DROP TABLE IF EXISTS ${escapedTable}`);
    log(`✅ Table '${tableName}' deleted (if existed).`);
  } catch (err) {
    throw err;
  } finally {
    await conn.end();
  }
}

const pool = (dbName: string) =>
  mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: dbName,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  });

type User = RowDataPacket & UserItem; // select, update, delete's return type require RowDataPacket

export async function queryEmail(email: string, db: string, userTable: string) {
  try {
    const sql = `SELECT * FROM ${userTable} WHERE email = ?`;
    const [rows] = await pool(db).query<User[]>(sql, [email]);
    return rows;
  } catch (err) {
    throw err;
  }
}

export async function insertUser(
  user: UserItem,
  db: string,
  userTable: string
) {
  try {
    const sql = `INSERT INTO ${userTable} (name, email, password, role, provider, providerId) VALUES (?, ?, ?, ?, ?, ?)`;
    // insert return tpye requres ResultSetHeader
    const [result] = await pool(db).query<ResultSetHeader>(sql, [
      user.name,
      user.email,
      user.password,
      user.role,
      user.provider,
      user.providerId,
    ]);
    return result;
  } catch (err) {
    throw err;
  }
}

// type Task = RowDataPacket & TaskItem;

// export async function queryTaskByData(
//   date: string,
//   useName: string,
//   db: string,
//   calendarTable: string
// ): Promise<Task[]> {
//   try {
//     const sql = `SELECT * FROM ${calendarTable} WHERE createDate = ? AND userName = ? ORDER BY checked ASC, important DESC, updateTime DESC`;
//     const [result] = await pool(db).query<Task[]>(sql, [date, useName]);
//     return result;
//   } catch (error) {
//     throw error;
//   }
// }
