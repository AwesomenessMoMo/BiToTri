# 🗄️ MySQL Database Setup Guide

Complete guide for setting up MySQL database for Bi To Tri Gym application.

## 📋 Table of Contents
1. [Local Development Setup](#local-development-setup)
2. [Railway MySQL Setup](#railway-mysql-setup)
3. [External MySQL Setup](#external-mysql-setup)
4. [Import Database Schema](#import-database-schema)
5. [Verify Database](#verify-database)
6. [Troubleshooting](#troubleshooting)

---

## 🖥️ Local Development Setup

### Step 1: Install MySQL

**Option A: XAMPP (Windows - Easiest)**
1. Download XAMPP from [apachefriends.org](https://www.apachefriends.org/)
2. Install XAMPP
3. Open XAMPP Control Panel
4. Start **MySQL** service
5. MySQL will run on `localhost:3306`

**Option B: MySQL Standalone**
1. Download MySQL from [mysql.com](https://dev.mysql.com/downloads/mysql/)
2. Install MySQL Server
3. During installation, set root password
4. Start MySQL service

**Option C: WAMP (Windows)**
1. Download WAMP from [wampserver.com](https://www.wampserver.com/)
2. Install WAMP
3. Start WAMP server
4. MySQL will be available

### Step 2: Create Database

**Using MySQL Command Line:**
```bash
mysql -u root -p
```

Then run:
```sql
CREATE DATABASE bitotri;
EXIT;
```

**Using phpMyAdmin (XAMPP/WAMP):**
1. Open browser: `http://localhost/phpmyadmin`
2. Click **"New"** in left sidebar
3. Database name: `bitotri`
4. Collation: `utf8mb4_general_ci`
5. Click **"Create"**

### Step 3: Import Schema

**Using Command Line:**
```bash
mysql -u root -p bitotri < bitotri.sql
```

**Using phpMyAdmin:**
1. Select `bitotri` database
2. Click **"Import"** tab
3. Click **"Choose File"**
4. Select `bitotri.sql` from project root
5. Click **"Go"** at bottom

### Step 4: Create .env File

Create `src/backend/.env` file:
```env
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=bitotri
MYSQL_PORT=3306
PORT=8080
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

**Important:** Replace `your_mysql_password` with your actual MySQL root password.

### Step 5: Test Connection

Start your backend:
```bash
cd src/backend
node server.js
```

You should see:
```
✅ Database connected successfully
Server running on port 8080
```

---

## 🚂 Railway MySQL Setup

### Option 1: Railway MySQL Service (Recommended)

#### Step 1: Add MySQL Service
1. Go to your Railway project dashboard
2. Click **"New Service"**
3. Select **"Database"** → **"MySQL"**
4. Railway automatically creates MySQL database

#### Step 2: Get Connection Details
1. Click on the MySQL service
2. Go to **"Variables"** tab
3. Railway provides these variables automatically:
   - `MYSQL_HOST` - Database host
   - `MYSQL_USER` - Database user
   - `MYSQL_PASSWORD` - Database password
   - `MYSQL_DATABASE` - Database name
   - `MYSQL_PORT` - Port (usually 3306)

#### Step 3: Link to Backend Service
1. Go to your **Backend** service
2. Click **"Variables"** tab
3. Railway automatically adds MySQL variables (if services are in same project)
4. If not, manually add:
   - Copy values from MySQL service variables
   - Add to Backend service variables

#### Step 4: Import Database Schema

**Method A: Using Railway MySQL Interface**
1. Click on MySQL service
2. Go to **"Data"** or **"Connect"** tab
3. Use Railway's database interface to run SQL
4. Copy contents of `bitotri.sql`
5. Paste and execute

**Method B: Using MySQL Client (Recommended)**
1. Get connection string from Railway MySQL service
2. Use MySQL client (MySQL Workbench, DBeaver, or command line):
   ```bash
   mysql -h $MYSQL_HOST -u $MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DATABASE < bitotri.sql
   ```
3. Or connect and import:
   ```bash
   mysql -h containers-us-west-xxx.railway.app -u root -p bitotri
   ```
   Then:
   ```sql
   source bitotri.sql;
   ```

**Method C: Using Railway CLI**
```bash
railway connect mysql
mysql -u root -p bitotri < bitotri.sql
```

### Option 2: External MySQL Database

If you have an existing MySQL database:

1. **Ensure Database is Accessible:**
   - Database must be accessible from Railway's network
   - Whitelist Railway IPs if using cloud MySQL (AWS RDS, etc.)

2. **Add Connection Details to Backend:**
   - Go to Backend service → **Variables**
   - Add:
     ```
     MYSQL_HOST=your-mysql-host.com
     MYSQL_USER=your_username
     MYSQL_PASSWORD=your_password
     MYSQL_DATABASE=bitotri
     MYSQL_PORT=3306
     ```

3. **Create Database:**
   ```sql
   CREATE DATABASE bitotri;
   ```

4. **Import Schema:**
   ```bash
   mysql -h your-mysql-host.com -u your_username -p bitotri < bitotri.sql
   ```

---

## 📥 Import Database Schema

### Using Command Line

**Local:**
```bash
mysql -u root -p bitotri < bitotri.sql
```

**Railway (with connection string):**
```bash
mysql -h $MYSQL_HOST -u $MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DATABASE < bitotri.sql
```

### Using phpMyAdmin

1. Select database (`bitotri`)
2. Click **"Import"** tab
3. Choose `bitotri.sql` file
4. Click **"Go"**

### Using MySQL Workbench

1. Connect to your database
2. File → Run SQL Script
3. Select `bitotri.sql`
4. Click **"Start Import"**

### Using Railway Database Interface

1. Go to MySQL service in Railway
2. Use the database interface
3. Copy SQL from `bitotri.sql`
4. Paste and execute

---

## ✅ Verify Database

### Check Connection

**Test from Backend:**
```bash
cd src/backend
node server.js
```

Should see: `✅ Database connected successfully`

**Test Health Endpoint:**
```
http://localhost:8080/api/health
```

Should return:
```json
{
  "status": "ok",
  "message": "Backend and database are connected"
}
```

### Check Tables

**Using MySQL Command Line:**
```bash
mysql -u root -p bitotri
```

```sql
SHOW TABLES;
```

Should show:
- cart
- cart_items
- clothes
- coaches
- coach_bookings
- orders
- order_items
- supplements
- users

**Check Data:**
```sql
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM coaches;
SELECT COUNT(*) FROM supplements;
```

### Test API Endpoints

```
http://localhost:8080/api/coaches
http://localhost:8080/api/supplements
http://localhost:8080/api/clothes
```

Should return JSON data (not errors).

---

## 🔧 Troubleshooting

### Issue: "Access denied for user"

**Solution:**
- Check MySQL username and password in `.env` file
- Verify user has permissions:
  ```sql
  GRANT ALL PRIVILEGES ON bitotri.* TO 'root'@'localhost';
  FLUSH PRIVILEGES;
  ```

### Issue: "Unknown database 'bitotri'"

**Solution:**
- Create the database first:
  ```sql
  CREATE DATABASE bitotri;
  ```

### Issue: "Can't connect to MySQL server"

**Solutions:**
- **Local:** Make sure MySQL service is running
  - XAMPP: Start MySQL in Control Panel
  - Windows: Check Services (services.msc)
- **Railway:** Verify connection details in environment variables
- Check if port 3306 is correct
- Verify host address is correct

### Issue: "Table doesn't exist"

**Solution:**
- Import `bitotri.sql` file:
  ```bash
  mysql -u root -p bitotri < bitotri.sql
  ```

### Issue: "Connection timeout" (Railway)

**Solutions:**
- Verify MySQL service is running in Railway
- Check if database is accessible from Railway network
- For external MySQL, whitelist Railway IPs
- Verify firewall settings

### Issue: "Too many connections"

**Solution:**
- Increase connection limit in MySQL
- Check connection pool settings in `config/db.js`

### Issue: Database connection works but queries fail

**Solution:**
- Verify tables exist: `SHOW TABLES;`
- Check if data was imported: `SELECT COUNT(*) FROM users;`
- Re-import `bitotri.sql` if needed

---

## 📝 Quick Reference

### Local Development .env
```env
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=bitotri
MYSQL_PORT=3306
```

### Railway Environment Variables
Railway automatically provides these when using Railway MySQL:
- `MYSQL_HOST` - Auto-set
- `MYSQL_USER` - Auto-set
- `MYSQL_PASSWORD` - Auto-set
- `MYSQL_DATABASE` - Auto-set
- `MYSQL_PORT` - Usually 3306

### Common Commands

**Connect to MySQL:**
```bash
mysql -u root -p
```

**Create Database:**
```sql
CREATE DATABASE bitotri;
```

**Import SQL File:**
```bash
mysql -u root -p bitotri < bitotri.sql
```

**Check Tables:**
```sql
USE bitotri;
SHOW TABLES;
```

**Check Data:**
```sql
SELECT * FROM users LIMIT 5;
```

---

## ✅ Setup Checklist

- [ ] MySQL installed and running
- [ ] Database `bitotri` created
- [ ] `bitotri.sql` imported successfully
- [ ] `.env` file created with correct credentials
- [ ] Backend connects to database (see ✅ message)
- [ ] Health endpoint returns success
- [ ] API endpoints return data
- [ ] Tables exist and have data

---

## 🎯 Next Steps

After MySQL is set up:
1. ✅ Database is ready
2. ✅ Backend can connect
3. ✅ Frontend can fetch data
4. 🚀 Ready for deployment!

**For Railway:** Follow `DEPLOY_TO_RAILWAY.md` for complete deployment guide.

---

## 💡 Tips

- **Keep passwords secure:** Never commit `.env` files to Git
- **Backup database:** Regularly backup your database
- **Use connection pooling:** Already configured in `config/db.js`
- **Test locally first:** Always test database connection locally before deploying
- **Railway MySQL:** Free tier includes MySQL, perfect for development

Need help? Check the troubleshooting section or Railway documentation.

