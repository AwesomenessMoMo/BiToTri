# Bi To Tri Gym - Full Stack Web Application

A comprehensive gym management system that enables users to book coaches, purchase supplements and gym apparel, manage subscriptions, and access training programs. Built with Node.js backend and React.js frontend.

## 🎯 Features

### User Features
- User Authentication (Login/Signup) with password hashing
- Coach browsing and booking with calendar integration
- E-Commerce store for supplements and gym apparel with shopping cart
- Checkout system with order management
- Subscription plan selection
- Training program access with PDF download
- Light/Dark theme toggle
- Global search functionality

### Admin Features
- Admin dashboard with protected routes
- CRUD operations for coaches, supplements, and clothes
- Booking management (view and update booking status)
- Image upload for products and coaches

## 🛠️ Technologies

**Backend:** Node.js, Express.js, MySQL, bcryptjs, jsonwebtoken, multer, cors

**Frontend:** React.js, React Router, Material-UI, Bootstrap, React Context API, Axios, React Calendar, jsPDF

**Deployment:** Railway, Git/GitHub

## 🗄️ Database Schema

The application uses MySQL with the following tables:
- `users` - User accounts and authentication
- `coaches` - Coach information
- `coach_bookings` - Booking records
- `supplements` - Supplement products
- `clothes` - Clothing products
- `cart` & `cart_items` - Shopping cart
- `orders` & `order_items` - Order records

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v14+)
- MySQL (v8.0+)
- Git

### Backend Setup

1. Clone the repository
   ```bash
   git clone https://github.com/AwesomenessMoMo/BiToTri.git
   cd BiToTri/src/backend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```env
   NODE_ENV=development
   PORT=5000
   MYSQL_HOST=localhost
   MYSQL_USER=root
   MYSQL_PASSWORD=your_password
   MYSQL_DATABASE=bitotri
   MYSQL_PORT=3306
   CLIENT_URL=http://localhost:3000
   ```

4. Create MySQL database: `CREATE DATABASE bitotri;`

5. Start server: `npm start` (or `npm run dev` for development)

### Frontend Setup

1. Navigate to frontend: `cd src/frontend`

2. Install dependencies: `npm install`

3. Create `.env` file:
   ```env
   REACT_APP_API_URL=http://localhost:5000
   ```

4. Start development server: `npm start`

## 📡 API Endpoints

**Authentication:**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

**Coaches:**
- `GET /api/coaches` - Get all coaches
- `POST /api/admin/coaches` - Create coach (Admin)
- `DELETE /api/admin/coaches/:id` - Delete coach (Admin)

**Bookings:**
- `POST /api/bookings` - Create booking
- `GET /api/user/bookings/:userId` - Get user bookings
- `DELETE /api/user/bookings/:bookingId/:userId` - Cancel booking
- `GET /api/admin/bookings` - Get all bookings (Admin)

**Products:**
- `GET /api/supplements` - Get all supplements
- `GET /api/supplements/:id` - Get supplement by ID
- `POST /api/admin/supplements` - Create supplement (Admin)
- `DELETE /api/admin/supplements/:id` - Delete supplement (Admin)
- Similar endpoints for `/api/clothes`

**Cart & Orders:**
- `POST /api/cart` - Add item to cart
- `GET /api/cart/:userId` - Get user cart
- `POST /api/checkout` - Create order

**Search:**
- `GET /api/search?q=query` - Global search

## 🚢 Deployment

The application is deployed on Railway:

- **Frontend:** https://bitotri-frontend-production.up.railway.app
- **Backend:** https://bitotri-production.up.railway.app

### Railway Setup

**Backend:**
1. Set root directory to `src/backend`
2. Add environment variables (MYSQL_*, CLIENT_URL)
3. Railway auto-detects Node.js

**Frontend:**
1. Set root directory to `src/frontend`
2. Add `REACT_APP_API_URL` environment variable
3. Railway builds and serves the React app

## 👤 Author

**Mohamad el Masri**

- GitHub: [@AwesomenessMoMo](https://github.com/AwesomenessMoMo)
- Project Link: [https://github.com/AwesomenessMoMo/BiToTri](https://github.com/AwesomenessMoMo/BiToTri)
