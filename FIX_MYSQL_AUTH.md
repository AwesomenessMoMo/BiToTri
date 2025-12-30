# 🔧 Fix MySQL Authentication Error

## Error Message
```
Access denied for user 'root'@'...' (using password: YES)
```

This means the MySQL password in your backend is incorrect.

---

## Step 1: Get Correct MySQL Password from Railway

1. Go to Railway dashboard
2. Click on **MySQL** service
3. Go to **Variables** tab
4. Look for these variables:
   - `MYSQLPASSWORD` (or `MYSQL_PASSWORD`)
   - `MYSQLHOST` (or `MYSQL_HOST`)
   - `MYSQLUSER` (or `MYSQL_USER`)
   - `MYSQLDATABASE` (or `MYSQL_DATABASE`)
   - `MYSQLPORT` (or `MYSQL_PORT`)

5. **Copy the password value** - this is what you need!

---

## Step 2: Update Backend Environment Variables

1. Click on **"BiToTri - Backend"** service
2. Go to **Variables** tab
3. **Update these variables:**

   ```
   MYSQL_HOST=mysql.railway.internal
   MYSQL_USER=root
   MYSQL_PASSWORD=[paste the password from MySQL service]
   MYSQL_DATABASE=bitotri
   MYSQL_PORT=3306
   ```

   **Important:**
   - Replace `[paste the password from MySQL service]` with the actual password from Step 1
   - Use `mysql.railway.internal` for `MYSQL_HOST` (internal connection, faster)
   - Make sure `MYSQL_DATABASE=bitotri` (not `railway`)

4. **Also ensure these exist:**
   ```
   CLIENT_URL=https://bitotri-frontend-production.up.railway.app
   NODE_ENV=production
   PORT=8080
   ```

5. Click **"Add"** or **"Update"** for each variable
6. Wait 1-2 minutes for Railway to redeploy

---

## Step 3: Alternative - Use Railway's Auto-Generated Variables

Railway automatically provides MySQL connection variables. You can use them directly:

### Option A: Use Railway Format Variables
Instead of `MYSQL_HOST`, Railway might use `MYSQLHOST`. Check what format your MySQL service uses:

1. In MySQL service → Variables tab
2. See if variables are:
   - `MYSQLHOST`, `MYSQLUSER`, `MYSQLPASSWORD`, etc. (Railway format)
   - OR `MYSQL_HOST`, `MYSQL_USER`, `MYSQL_PASSWORD`, etc. (Standard format)

3. **If Railway format**, update backend variables to match:
   ```
   MYSQLHOST=mysql.railway.internal
   MYSQLUSER=root
   MYSQLPASSWORD=[password from MySQL service]
   MYSQLDATABASE=bitotri
   MYSQLPORT=3306
   ```

### Option B: Use Standard Format (Recommended)
Your `db.js` supports both formats, but use standard format:
```
MYSQL_HOST=mysql.railway.internal
MYSQL_USER=root
MYSQL_PASSWORD=[password]
MYSQL_DATABASE=bitotri
MYSQL_PORT=3306
```

---

## Step 4: Verify Database Connection

1. Wait 1-2 minutes after updating variables
2. Test backend health:
   ```
   https://bitotri-production.up.railway.app/api/health
   ```

   **Should return:**
   ```json
   {
     "status": "ok",
     "message": "Backend and database are connected"
   }
   ```

3. If still error, check backend logs:
   - Go to Backend service → Deployments → Latest → Logs
   - Look for database connection messages

---

## Step 5: Create bitotri Database (If Not Exists)

1. Go to MySQL service → Data tab
2. Run:
   ```sql
   CREATE DATABASE IF NOT EXISTS bitotri;
   ```

3. Select `bitotri` database
4. Import your `bitotri.sql` file

---

## Common Issues

### Issue 1: Password Has Special Characters
**Problem:** Password contains special characters that break when copying

**Fix:**
- Copy password carefully from Railway
- Don't add extra spaces
- Use Railway's "Copy" button if available

### Issue 2: Using Wrong Database
**Problem:** `MYSQL_DATABASE` is set to `railway` instead of `bitotri`

**Fix:**
- Update `MYSQL_DATABASE=bitotri` in backend variables
- Create `bitotri` database if it doesn't exist

### Issue 3: Using External Host Instead of Internal
**Problem:** Using public MySQL host instead of internal

**Fix:**
- Use `mysql.railway.internal` for `MYSQL_HOST`
- This is faster and free (no data transfer costs)

---

## Quick Checklist

- [ ] Got MySQL password from MySQL service Variables tab
- [ ] Updated `MYSQL_PASSWORD` in backend variables
- [ ] Set `MYSQL_HOST=mysql.railway.internal`
- [ ] Set `MYSQL_DATABASE=bitotri` (not `railway`)
- [ ] Set `MYSQL_USER=root`
- [ ] Set `MYSQL_PORT=3306`
- [ ] Created `bitotri` database
- [ ] Imported `bitotri.sql`
- [ ] Tested backend health endpoint
- [ ] Backend logs show "Database connected successfully"

---

## Still Having Issues?

1. **Check Backend Logs:**
   - Backend service → Deployments → Latest → Logs
   - Look for specific error messages

2. **Verify MySQL Service:**
   - MySQL service should be "Online" (green)
   - Check MySQL service logs for issues

3. **Try Both Variable Formats:**
   - Try `MYSQL_HOST` format first
   - If that doesn't work, try `MYSQLHOST` format

4. **Double-Check Password:**
   - Copy password directly from MySQL service
   - Don't modify it
   - Make sure no extra spaces

---

## 🎯 Most Likely Fix

The password in your backend variables doesn't match the MySQL service password. 

**Quick Fix:**
1. Copy `MYSQLPASSWORD` from MySQL service → Variables
2. Paste it into Backend → Variables → `MYSQL_PASSWORD`
3. Wait for redeploy
4. Test health endpoint

This should fix the authentication error!


