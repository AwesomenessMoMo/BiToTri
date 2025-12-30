const mysql = require("mysql2");

// Support both standard format (MYSQL_HOST) and Railway format (MYSQLHOST)
const db = mysql.createPool({
  host: process.env.MYSQL_HOST || process.env.MYSQLHOST || "localhost",
  user: process.env.MYSQL_USER || process.env.MYSQLUSER || "root",
  password: process.env.MYSQL_PASSWORD || process.env.MYSQLPASSWORD || "",
  database: process.env.MYSQL_DATABASE || process.env.MYSQLDATABASE || "bitotri",
  port: process.env.MYSQL_PORT || process.env.MYSQLPORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection on startup
db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
    console.error("Please check your database configuration in .env file");
    console.error("Required variables: MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE, MYSQL_PORT");
  } else {
    console.log("✅ Database connected successfully");
    connection.release();
  }
});

module.exports = db;
