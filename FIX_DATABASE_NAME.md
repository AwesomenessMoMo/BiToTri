# 🔧 Fix Database Name Issue

## Problem
Your MySQL service has `MYSQLDATABASE=railway`, but your backend needs `bitotri` database.

## Solution

### Step 1: Update Backend Environment Variables

Go to **"BiToTri - Backend"** service → **Variables** tab

Add/Update these variables (use Railway format):

```
MYSQLHOST=mysql.railway.internal
MYSQLUSER=root
MYSQLPASSWORD=GRMcuPcxasVDNvSBnGEGdWMPiqXLrzap
MYSQLDATABASE=bitotri
MYSQLPORT=3306
CLIENT_URL=https://bitotri-frontend-production.up.railway.app
NODE_ENV=production
PORT=8080
```

**Important:**
- Use `MYSQLDATABASE=bitotri` (not `railway`)
- This overrides Railway's default `railway` database
- Copy the password exactly: `GRMcuPcxasVDNvSBnGEGdWMPiqXLrzap`

### Step 2: Create bitotri Database

1. Go to **MySQL** service
2. Go to **Data** or **Connect** tab
3. Run this SQL:
   ```sql
   CREATE DATABASE IF NOT EXISTS bitotri;
   ```

### Step 3: Import Database Schema

1. In MySQL service, select `bitotri` database
2. Go to **Import** or **SQL** tab
3. Copy contents of `bitotri.sql` from your local project
4. Paste and execute
5. Verify tables were created (coaches, supplements, clothes, etc.)

### Step 4: Test Connection

After updating variables, wait 1-2 minutes, then test:

```
https://bitotri-production.up.railway.app/api/health
```

Should return:
```json
{
  "status": "ok",
  "message": "Backend and database are connected"
}
```

---

## Why This Happens

Railway's MySQL service creates a default database called `railway`. But your application needs the `bitotri` database with your specific schema and data.

By setting `MYSQLDATABASE=bitotri` in backend variables, you override Railway's default and tell your backend to connect to the `bitotri` database instead.

---

## Quick Checklist

- [ ] Backend `MYSQLDATABASE=bitotri` (not `railway`)
- [ ] Backend `MYSQLPASSWORD=GRMcuPcxasVDNvSBnGEGdWMPiqXLrzap`
- [ ] Backend `MYSQLHOST=mysql.railway.internal`
- [ ] Backend `MYSQLUSER=root`
- [ ] Backend `MYSQLPORT=3306`
- [ ] `bitotri` database created in MySQL service
- [ ] `bitotri.sql` imported into `bitotri` database
- [ ] Backend health check passes

---

This should fix the database connection issue!


