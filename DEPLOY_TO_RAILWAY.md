# 🚀 Deploy Bi To Tri Gym to Railway - Complete Guide

## 📋 Prerequisites

1. **GitHub Account** - Your code should be on GitHub
2. **Railway Account** - Sign up at [railway.app](https://railway.app)
3. **MySQL Database** - Railway MySQL service or external database

## 🏗️ Project Structure

```
Bi To Tri Gym/
├── src/
│   ├── backend/          # Backend service (Root: src/backend)
│   │   ├── server.js
│   │   ├── package.json
│   │   ├── nixpacks.toml
│   │   └── railway.json
│   └── frontend/          # Frontend service (Root: src/frontend)
│       ├── src/
│       ├── package.json
│       ├── nixpacks.toml
│       └── railway.json
└── bitotri.sql           # Database schema
```

## 🚀 Step-by-Step Deployment

### Step 1: Prepare Your Repository

1. **Commit all changes:**
   ```bash
   git add .
   git commit -m "Ready for Railway deployment"
   git push origin main
   ```

### Step 2: Deploy Backend Service

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository
5. **IMPORTANT:** Click on the service → **Settings** → **Root Directory**
   - Set to: `src/backend`
6. Go to **Variables** tab and add:

   ```env
   MYSQL_HOST=containers-us-west-xxx.railway.app
   MYSQL_USER=root
   MYSQL_PASSWORD=your_mysql_password
   MYSQL_DATABASE=bitotri
   MYSQL_PORT=3306
   NODE_ENV=production
   CLIENT_URL=https://your-frontend.railway.app
   PORT=8080
   ```

   **Note:** You'll update `CLIENT_URL` after deploying frontend.

7. Railway will automatically:
   - Detect `nixpacks.toml`
   - Install dependencies
   - Start the server

8. **Get your backend URL:**
   - Go to **Settings** → **Domains**
   - Copy the Railway-provided domain (e.g., `your-backend.railway.app`)

### Step 3: Set Up MySQL Database

**Option A: Railway MySQL (Recommended)**

1. In your Railway project, click **"New Service"**
2. Select **"Database"** → **"MySQL"**
3. Railway will automatically create a MySQL database
4. Railway will provide connection details in environment variables
5. **Import your database:**
   - Use Railway's database interface, or
   - Connect via MySQL client:
     ```bash
     mysql -h $MYSQL_HOST -u $MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DATABASE < bitotri.sql
     ```

**Option B: External MySQL**

1. Use your existing MySQL database
2. Ensure it's accessible from Railway's network
3. Add connection details to backend environment variables

### Step 4: Deploy Frontend Service

1. In the same Railway project, click **"New Service"**
2. Select **"Deploy from GitHub repo"**
3. Choose the same repository
4. **IMPORTANT:** Click on the service → **Settings** → **Root Directory**
   - Set to: `src/frontend`
5. Go to **Variables** tab and add:

   ```env
   REACT_APP_API_URL=https://your-backend.railway.app
   PORT=3000
   ```

   **Replace** `your-backend.railway.app` with your actual backend URL from Step 2.

6. Railway will automatically:
   - Detect `nixpacks.toml`
   - Install dependencies
   - Build the React app (`npm run build`)
   - Serve the build (`npx serve -s build -l $PORT`)

7. **Get your frontend URL:**
   - Go to **Settings** → **Domains**
   - Copy the Railway-provided domain (e.g., `your-frontend.railway.app`)

### Step 5: Update Environment Variables

1. **Backend Service:**
   - Update `CLIENT_URL` to your frontend URL:
     ```
     CLIENT_URL=https://your-frontend.railway.app
     ```
   - Railway will automatically redeploy

2. **Frontend Service:**
   - Verify `REACT_APP_API_URL` matches your backend URL
   - If you changed it, Railway will rebuild automatically

### Step 6: Verify Deployment

1. **Test Backend:**
   ```
   https://your-backend.railway.app/api/health
   ```
   Should return: `{"status":"ok","message":"Backend and database are connected"}`

2. **Test Frontend:**
   ```
   https://your-frontend.railway.app
   ```
   Should load your React app

3. **Test API Endpoints:**
   ```
   https://your-backend.railway.app/api/coaches
   https://your-backend.railway.app/api/supplements
   https://your-backend.railway.app/api/clothes
   ```

## 🔧 Configuration Files

### Backend (`src/backend/nixpacks.toml`)
```toml
[phases.setup]
nixPkgs = ["nodejs-18_x"]

[phases.install]
cmds = ["npm install"]

[start]
cmd = "npm start"
```

### Frontend (`src/frontend/nixpacks.toml`)
```toml
[phases.setup]
nixPkgs = ["nodejs-18_x"]

[phases.install]
cmds = ["npm ci"]

[phases.build]
cmds = ["npm run build"]

[start]
cmd = "npx serve -s build -l $PORT"
```

## 📝 Environment Variables Summary

### Backend Variables (Railway)
| Variable | Description | Example |
|----------|-------------|---------|
| `MYSQL_HOST` | MySQL host | `containers-us-west-xxx.railway.app` |
| `MYSQL_USER` | MySQL username | `root` |
| `MYSQL_PASSWORD` | MySQL password | `your_password` |
| `MYSQL_DATABASE` | Database name | `bitotri` |
| `MYSQL_PORT` | MySQL port | `3306` |
| `CLIENT_URL` | Frontend URL | `https://your-frontend.railway.app` |
| `NODE_ENV` | Environment | `production` |
| `PORT` | Server port | `8080` (auto-set by Railway) |

### Frontend Variables (Railway)
| Variable | Description | Example |
|----------|-------------|---------|
| `REACT_APP_API_URL` | Backend API URL | `https://your-backend.railway.app` |
| `PORT` | Server port | `3000` (auto-set by Railway) |

### Local Development (.env files)

**Backend (`src/backend/.env`):**
```env
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=bitotri
MYSQL_PORT=3306
PORT=8080
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

**Frontend (`src/frontend/.env`):**
```env
REACT_APP_API_URL=http://localhost:8080
```

## 🗄️ Database Setup

### Step 1: Create Database
1. Open MySQL command line or phpMyAdmin
2. Create the database:
   ```sql
   CREATE DATABASE bitotri;
   ```

### Step 2: Import Schema
Import `bitotri.sql` file:
- **Using phpMyAdmin:**
  - Select `bitotri` database
  - Go to Import tab
  - Choose `bitotri.sql` file
  - Click Go

- **Using command line:**
  ```bash
  mysql -u root -p bitotri < bitotri.sql
  ```

### Step 3: Verify Database
Test the connection:
```bash
mysql -u root -p -e "USE bitotri; SELECT COUNT(*) FROM users;"
```

### Common Database Issues
- **"Access denied"** → Check MySQL username/password
- **"Unknown database"** → Create database first
- **"Can't connect"** → Ensure MySQL is running
- **"Table doesn't exist"** → Import `bitotri.sql` file

## 🐛 Troubleshooting

### Build Fails
- ✅ Check Root Directory is set correctly (`src/backend` or `src/frontend`)
- ✅ Verify `nixpacks.toml` files exist in correct directories
- ✅ Check Railway build logs for specific errors
- ✅ Ensure `package.json` has correct scripts

### Database Connection Fails
- ✅ Verify MySQL credentials in environment variables
- ✅ Check if database is accessible from Railway
- ✅ Ensure `bitotri` database exists and is imported
- ✅ Verify MySQL service is running (if using Railway MySQL)

### CORS Errors
- ✅ Verify `CLIENT_URL` in backend matches frontend URL exactly
- ✅ Check that both services are deployed and running
- ✅ Ensure URLs use `https://` (not `http://`)

### Frontend Can't Connect to Backend
- ✅ Verify `REACT_APP_API_URL` is set correctly
- ✅ Check backend is running and accessible
- ✅ Test backend health endpoint manually
- ✅ Verify CORS configuration allows frontend origin

### 404 Errors on Frontend Routes
- ✅ This is normal for React Router - Railway serves the app correctly
- ✅ All routes should work when accessed directly

## 🌐 Custom Domains

1. Go to service **Settings** → **Domains**
2. Click **"Generate Domain"** or **"Custom Domain"**
3. For custom domain:
   - Add your domain
   - Configure DNS as instructed by Railway
   - Update environment variables with new domain

## 📊 Monitoring

- **Logs:** View real-time logs in Railway dashboard
- **Metrics:** Check service health and performance
- **Deployments:** View deployment history and rollback if needed

## 🔄 Updating Your App

1. Make changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your update message"
   git push origin main
   ```
3. Railway will automatically detect changes and redeploy

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Backend service deployed with correct root directory
- [ ] MySQL database set up and `bitotri.sql` imported
- [ ] Backend environment variables configured
- [ ] Frontend service deployed with correct root directory
- [ ] Frontend environment variables configured
- [ ] `CLIENT_URL` updated in backend
- [ ] `REACT_APP_API_URL` set in frontend
- [ ] Health check endpoint working
- [ ] Frontend loads correctly
- [ ] API endpoints return data
- [ ] CORS working (no errors in browser console)

## 🎉 You're Live!

Your Bi To Tri Gym application is now live on Railway! 🚀

**Backend:** `https://your-backend.railway.app`  
**Frontend:** `https://your-frontend.railway.app`

