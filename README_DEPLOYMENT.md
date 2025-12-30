# 🚀 Quick Start - Deploy to Railway

## One-Click Deployment Guide

### Prerequisites
- ✅ Code pushed to GitHub
- ✅ Railway account (free tier works)

### Deployment Steps

#### 1. Deploy Backend (5 minutes)

1. Go to [Railway](https://railway.app) → New Project → Deploy from GitHub
2. Select your repo
3. **Set Root Directory:** `src/backend`
4. Add these environment variables:
   ```
   MYSQL_HOST=your-mysql-host
   MYSQL_USER=root
   MYSQL_PASSWORD=your-password
   MYSQL_DATABASE=bitotri
   MYSQL_PORT=3306
   NODE_ENV=production
   ```
5. Copy your backend URL (e.g., `your-backend.railway.app`)

#### 2. Deploy Frontend (5 minutes)

1. In same project → New Service → Deploy from GitHub
2. Select same repo
3. **Set Root Directory:** `src/frontend`
4. Add environment variable:
   ```
   REACT_APP_API_URL=https://your-backend.railway.app
   ```
5. Copy your frontend URL

#### 3. Update Backend CORS

1. Go to Backend service → Variables
2. Add:
   ```
   CLIENT_URL=https://your-frontend.railway.app
   ```

#### 4. Set Up Database

1. Add MySQL service in Railway, OR
2. Import `bitotri.sql` to your database

### ✅ Done!

Your app is live at:
- Frontend: `https://your-frontend.railway.app`
- Backend: `https://your-backend.railway.app`

**Full guide:** See `DEPLOY_TO_RAILWAY.md` for detailed instructions.

