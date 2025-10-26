import mysql, { Connection, ConnectionOptions } from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const config: ConnectionOptions = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};

const db: Connection = mysql.createConnection(config);

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection error:", err);
  } else {
    console.log("✅ MySQL Connected!");
  }
});

export default db;
