import mysql, { ResultSetHeader, RowDataPacket } from "mysql2/promise";
import { log } from "../utils";
import { type UserItem } from "../model/userModel";

const dbName =
  process.env.ENV === "dev" ? "todocalendar_dev" : "todocalendar_prod";
const userTable = "users";
const calendarTable = "calendar";

export async function initDB() {
  // use root role to create db
  const conn = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_ROOT_USER,
    password: process.env.MYSQL_ROOT_PASSWORD,
  });

  await conn.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
  log("✅ Database created");

  await conn.query(`
    GRANT ALL PRIVILEGES ON ${dbName}.* TO 'xiaoruiwang'@'%'
  `);
  log("✅ Privileges granted");

  await conn.query(`FLUSH PRIVILEGES`);
  log("✅ Privileges flushed");

  await conn.end();
}

export async function createTables() {
  // use user role to create tables
  const conn = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
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

const pool = mysql.createPool({
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

export async function queryEmail(email: string) {
  try {
    const sql = `SELECT * FROM ${userTable} WHERE email = ?`;
    const [rows] = await pool.query<User[]>(sql, [email]);
    return rows;
  } catch (err) {
    throw err;
  }
}

export async function insertUser(user: UserItem) {
  try {
    const sql = `INSERT INTO ${userTable} (name, email, password, role, provider, providerId) VALUES (?, ?, ?, ?, ?, ?)`;
    // insert return tpye requres ResultSetHeader
    const [result] = await pool.query<ResultSetHeader>(sql, [
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
