# 🔧 Railway MySQL Configuration Guide

## Railway MySQL Variables

Railway provides MySQL connection variables in two formats:

### Format 1: With Underscores (Standard)
- `MYSQL_DATABASE` = `railway`
- `MYSQL_HOST` = `mysql.railway.internal` (internal) or `interchange.proxy.rlwy.net` (public)
- `MYSQL_USER` = `root`
- `MYSQL_PASSWORD` = `KYXRnwHHGGOhjKeZNpFv0oSdmlnrKwQr`
- `MYSQL_PORT` = `3306`

### Format 2: Without Underscores (Railway-specific)
- `MYSQLDATABASE` = `railway`
- `MYSQLHOST` = `mysql.railway.internal`
- `MYSQLUSER` = `root`
- `MYSQLPASSWORD` = `KYXRnwHHGGOhjKeZNpFv0oSdmlnrKwQr`
- `MYSQLPORT` = `3306`

### Connection URLs
- `MYSQL_URL` = Internal connection string
- `MYSQL_PUBLIC_URL` = Public connection string (for external access)

## 📝 Backend Configuration

Your backend expects these environment variables:
- `MYSQL_HOST`
- `MYSQL_USER`
- `MYSQL_PASSWORD`
- `MYSQL_DATABASE`
- `MYSQL_PORT`

## ✅ Solution: Update Backend Code

The backend code needs to handle both Railway's variable formats. Here's what to do:

### Option 1: Use Railway's Standard Variables (Recommended)

Railway automatically provides both formats. Your backend should use the standard format:
- `MYSQL_HOST` (from `MYSQLHOST` or `MYSQL_HOST`)
- `MYSQL_USER` (from `MYSQLUSER` or `MYSQL_USER`)
- `MYSQL_PASSWORD` (from `MYSQLPASSWORD` or `MYSQL_PASSWORD`)
- `MYSQL_DATABASE` (from `MYSQLDATABASE` or `MYSQL_DATABASE`)
- `MYSQL_PORT` (from `MYSQLPORT` or `MYSQL_PORT`)

### Option 2: Update Backend to Support Both Formats

Update `config/db.js` to check for both variable name formats.

## 🚀 Steps to Configure

### Step 1: Add Variables to Backend Service

In Railway dashboard:
1. Go to your **Backend** service
2. Click **Variables** tab
3. Railway should automatically add MySQL variables (if MySQL service is in same project)
4. If not, manually add these variables:

```env
MYSQL_HOST=mysql.railway.internal
MYSQL_USER=root
MYSQL_PASSWORD=KYXRnwHHGGOhjKeZNpFv0oSdmlnrKwQr
MYSQL_DATABASE=railway
MYSQL_PORT=3306
```

**Note:** Railway automatically provides these, but you may need to rename them or your backend needs to read the correct format.

### Step 2: Update Database Name

**Important:** Railway creates a database named `railway` by default, but your app uses `bitotri`.

**Option A: Create bitotri Database**
```sql
CREATE DATABASE bitotri;
```

**Option B: Use Railway Database**
- Update `MYSQL_DATABASE` to `railway`
- Import your schema to `railway` database instead

### Step 3: Import Database Schema

Connect to Railway MySQL and import `bitotri.sql`:

**Using MySQL Client:**
```bash
mysql -h interchange.proxy.rlwy.net -P 20151 -u root -p railway
```

Then:
```sql
CREATE DATABASE bitotri;
USE bitotri;
SOURCE bitotri.sql;
```

Or import directly:
```bash
mysql -h interchange.proxy.rlwy.net -P 20151 -u root -p railway < bitotri.sql
```

**Using Railway Database Interface:**
1. Go to MySQL service in Railway
2. Use the database interface
3. Create `bitotri` database
4. Import `bitotri.sql`

## 🔧 Update Backend Code

Update `config/db.js` to handle Railway's variable formats:

```javascript
const mysql = require("mysql2");

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
```

## ✅ Verification

After configuration:
1. Backend should connect to Railway MySQL
2. Database `bitotri` should exist with all tables
3. Health endpoint should return success
4. API endpoints should return data

## 📋 Quick Reference

**Railway MySQL Connection:**
- Host: `mysql.railway.internal` (internal) or `interchange.proxy.rlwy.net` (public)
- Port: `3306` (internal) or `20151` (public)
- User: `root`
- Password: `KYXRnwHHGGOhjKeZNpFv0oSdmlnrKwQr`
- Database: `railway` (default) or `bitotri` (create new)

**Backend Environment Variables Needed:**
```
MYSQL_HOST=mysql.railway.internal
MYSQL_USER=root
MYSQL_PASSWORD=KYXRnwHHGGOhjKeZNpFv0oSdmlnrKwQr
MYSQL_DATABASE=bitotri
MYSQL_PORT=3306
```

