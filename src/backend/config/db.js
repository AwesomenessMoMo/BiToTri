const mysql = require("mysql2");

// Load environment variables for local development
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Support both standard format (MYSQL_HOST) and Railway format (MYSQLHOST)
// Priority: Environment variables > Local defaults
const db = mysql.createPool({
  host: process.env.MYSQL_HOST || process.env.MYSQLHOST || "localhost",
  user: process.env.MYSQL_USER || process.env.MYSQLUSER || "root",
  password: process.env.MYSQL_PASSWORD || process.env.MYSQLPASSWORD || "",
  database: process.env.MYSQL_DATABASE || process.env.MYSQLDATABASE || "railway",
  port: parseInt(process.env.MYSQL_PORT || process.env.MYSQLPORT || "3306"),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection on startup
db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Database connection failed:", err.message);
    const actualHost = process.env.MYSQL_HOST || process.env.MYSQLHOST || "localhost";
    const actualUser = process.env.MYSQL_USER || process.env.MYSQLUSER || "root";
    const actualDatabase = process.env.MYSQL_DATABASE || process.env.MYSQLDATABASE || "railway";
    const actualPort = process.env.MYSQL_PORT || process.env.MYSQLPORT || 3306;
    const passwordSet = !!(process.env.MYSQL_PASSWORD || process.env.MYSQLPASSWORD);
    
    console.error("Current config:", {
      host: actualHost,
      user: actualUser,
      database: actualDatabase,
      port: actualPort,
      password: passwordSet ? "***SET***" : "***NOT SET***"
    });
    console.error("\nEnvironment variables found:");
    console.error("  MYSQL_HOST:", process.env.MYSQL_HOST ? "SET" : "NOT SET");
    console.error("  MYSQLHOST:", process.env.MYSQLHOST ? "SET" : "NOT SET");
    console.error("  MYSQL_USER:", process.env.MYSQL_USER ? "SET" : "NOT SET");
    console.error("  MYSQLUSER:", process.env.MYSQLUSER ? "SET" : "NOT SET");
    console.error("  MYSQL_PASSWORD:", process.env.MYSQL_PASSWORD ? "SET" : "NOT SET");
    console.error("  MYSQLPASSWORD:", process.env.MYSQLPASSWORD ? "SET" : "NOT SET");
    console.error("  MYSQL_DATABASE:", process.env.MYSQL_DATABASE ? "SET" : "NOT SET");
    console.error("  MYSQLDATABASE:", process.env.MYSQLDATABASE ? "SET" : "NOT SET");
    console.error("\nFor local development, ensure:");
    console.error("  1. MySQL is running (XAMPP/WAMP)");
    console.error("  2. Database 'railway' exists (or 'bitotri' if using local)");
    console.error("  3. .env file in src/backend/ has correct credentials (optional)");
  } else {
    console.log("✅ Database connected successfully");
    console.log(`   Host: ${connection.config.host}`);
    console.log(`   Database: ${connection.config.database}`);
    connection.release();
  }
});

module.exports = db;
