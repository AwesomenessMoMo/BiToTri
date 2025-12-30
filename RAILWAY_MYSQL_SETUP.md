# 🚂 Railway MySQL Setup - Step by Step

## Your Railway MySQL Details

From your Railway dashboard:
- **Host (Internal):** `mysql.railway.internal`
- **Host (Public):** `interchange.proxy.rlwy.net:20151`
- **User:** `root`
- **Password:** `KYXRnwHHGGOhjKeZNpFv0oSdmlnrKwQr`
- **Database:** `railway` (default) - **You need to create `bitotri`**

## Step 1: Create bitotri Database

### Option A: Using Railway Database Interface
1. Go to your MySQL service in Railway
2. Click on the database interface/console
3. Run:
   ```sql
   CREATE DATABASE bitotri;
   ```

### Option B: Using MySQL Client
Connect to Railway MySQL:
```bash
mysql -h interchange.proxy.rlwy.net -P 20151 -u root -p
# Enter password: KYXRnwHHGGOhjKeZNpFv0oSdmlnrKwQr
```

Then:
```sql
CREATE DATABASE bitotri;
EXIT;
```

## Step 2: Import Database Schema

### Option A: Using Railway Database Interface
1. Select `bitotri` database
2. Go to Import/SQL tab
3. Copy contents of `bitotri.sql`
4. Paste and execute

### Option B: Using MySQL Client
```bash
mysql -h interchange.proxy.rlwy.net -P 20151 -u root -p bitotri < bitotri.sql
# Enter password when prompted
```

### Option C: Using MySQL Command Line
```bash
mysql -h interchange.proxy.rlwy.net -P 20151 -u root -p
# Enter password: KYXRnwHHGGOhjKeZNpFv0oSdmlnrKwQr
```

Then:
```sql
USE bitotri;
SOURCE bitotri.sql;
```

## Step 3: Configure Backend Service

### In Railway Dashboard:

1. **Go to Backend Service** → **Variables** tab

2. **Add/Verify these variables:**
   ```
   MYSQL_HOST=mysql.railway.internal
   MYSQL_USER=root
   MYSQL_PASSWORD=KYXRnwHHGGOhjKeZNpFv0oSdmlnrKwQr
   MYSQL_DATABASE=bitotri
   MYSQL_PORT=3306
   ```

   **Note:** Railway may auto-provide these, but ensure:
   - Variable names use underscores (MYSQL_HOST, not MYSQLHOST)
   - Database name is `bitotri` (not `railway`)

3. **If Railway provides variables without underscores:**
   - The backend code now supports both formats
   - But you can also add aliases:
     ```
     MYSQL_HOST=$MYSQLHOST
     MYSQL_USER=$MYSQLUSER
     MYSQL_PASSWORD=$MYSQLPASSWORD
     MYSQL_DATABASE=bitotri
     MYSQL_PORT=$MYSQLPORT
     ```

## Step 4: Verify Connection

After deploying backend:
1. Check backend logs in Railway
2. Should see: `✅ Database connected successfully`
3. Test health endpoint: `https://your-backend.railway.app/api/health`
4. Should return: `{"status":"ok","message":"Backend and database are connected"}`

## 🔧 Quick Reference

**Connection String (Public):**
```
mysql://root:KYXRnwHHGGOhjKeZNpFv0oSdmlnrKwQr@interchange.proxy.rlwy.net:20151/railway
```

**Connection String (Internal - for Railway services):**
```
mysql://root:KYXRnwHHGGOhjKeZNpFv0oSdmlnrKwQr@mysql.railway.internal:3306/bitotri
```

**Backend Environment Variables:**
```env
MYSQL_HOST=mysql.railway.internal
MYSQL_USER=root
MYSQL_PASSWORD=KYXRnwHHGGOhjKeZNpFv0oSdmlnrKwQr
MYSQL_DATABASE=bitotri
MYSQL_PORT=3306
```

## ✅ Checklist

- [ ] Created `bitotri` database in Railway MySQL
- [ ] Imported `bitotri.sql` schema
- [ ] Added environment variables to Backend service
- [ ] Verified database name is `bitotri`
- [ ] Backend connects successfully
- [ ] Health endpoint returns success
- [ ] API endpoints return data

## 🎯 Important Notes

1. **Database Name:** Railway creates `railway` by default, but you need `bitotri`
2. **Host:** Use `mysql.railway.internal` for internal connections (faster, free)
3. **Port:** Use `3306` for internal, `20151` for public
4. **Variables:** Backend now supports both Railway formats automatically

Your backend code is already updated to work with Railway's MySQL! 🚀

