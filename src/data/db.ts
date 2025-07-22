import mysql from "mysql2/promise";

const dbName =
  process.env.ENV === "dev" ? "todocalendar_dev" : "todocalendar_prod";

export async function initDB() {
  const conn = await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_ROOT_USER,
    password: process.env.MYSQL_ROOT_PASSWORD,
  });

  await conn.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
  console.log("✅ Database created");

  await conn.query(`
    GRANT ALL PRIVILEGES ON ${dbName}.* TO 'xiaoruiwang'@'%'
  `);
  console.log("✅ Privileges granted");

  await conn.query(`FLUSH PRIVILEGES`);
  console.log("✅ Privileges flushed");

  await conn.end();
}
