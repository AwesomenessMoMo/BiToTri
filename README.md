# Bi To Tri Gym - Full Stack Web Application

A comprehensive gym management system that enables users to book coaches, purchase supplements and gym apparel, manage subscriptions, and access training programs. Built with Node.js backend and React.js frontend.

## 📋 Table of Contents

- [Project Description](#project-description)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Database Schema](#database-schema)
- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
- [Code Snippets](#code-snippets)
- [Deployment](#deployment)
- [Screenshots](#screenshots)
- [Future Scope](#future-scope)

## 🎯 Project Description

**Bi To Tri Gym** is a full-stack web application designed to solve the real-world problem of managing a gym's operations digitally. The application automates:

- **Coach Booking System**: Users can browse coaches, view their schedules, and book appointments
- **E-Commerce Store**: Complete shopping experience for supplements and gym apparel with cart management
- **Subscription Management**: Monthly and annual subscription plans for gym memberships
- **Training Programs**: Access to structured workout programs with PDF generation
- **Admin Panel**: Complete CRUD operations for managing coaches, products, and bookings

### Problem Solved

This application eliminates the need for manual booking systems, paper-based inventory management, and in-person subscription handling. It provides a centralized platform for both gym members and administrators.

## ✨ Features

### User Features
- ✅ User Authentication (Login/Signup) with password hashing
- ✅ Coach browsing and booking with calendar integration
- ✅ Product browsing (Supplements & Clothes) with filtering and sorting
- ✅ Shopping cart with quantity management
- ✅ Checkout system with order management
- ✅ Subscription plan selection
- ✅ Training program access with PDF download
- ✅ User booking history
- ✅ Light/Dark theme toggle

### Admin Features
- ✅ Admin dashboard with protected routes
- ✅ CRUD operations for coaches (Create, Read, Update, Delete)
- ✅ CRUD operations for supplements
- ✅ CRUD operations for clothes
- ✅ Booking management (view and update booking status)
- ✅ Image upload for products and coaches

### Technical Features
- ✅ RESTful API architecture
- ✅ MySQL database with proper relationships
- ✅ Data validation and error handling
- ✅ File upload handling (Multer)
- ✅ CORS configuration for cross-origin requests
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Git version control with commit history

## 🛠️ Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Relational database
- **bcryptjs** - Password hashing
- **jsonwebtoken** - Authentication tokens
- **multer** - File upload handling
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Frontend
- **React.js** - UI framework
- **React Router** - Client-side routing
- **Material-UI** - UI component library
- **Bootstrap** - CSS framework
- **React Context API** - State management
- **Axios** - HTTP client
- **React Calendar** - Calendar component
- **jsPDF** - PDF generation

### Deployment
- **Railway** - Backend and frontend hosting
- **Git/GitHub** - Version control

## 🗄️ Database Schema

The application uses MySQL with the following related entities:

### Core Tables

1. **users**
   - `id` (Primary Key)
   - `name`
   - `email` (Unique)
   - `password` (Hashed)
   - `role` (user/admin)

2. **coaches**
   - `id` (Primary Key)
   - `name`
   - `specialty`
   - `bio`
   - `image`

3. **coach_bookings**
   - `id` (Primary Key)
   - `user_id` (Foreign Key → users)
   - `coach_id` (Foreign Key → coaches)
   - `booking_date`
   - `booking_time`
   - `status`

4. **supplements**
   - `id` (Primary Key)
   - `name`
   - `category`
   - `description`
   - `price`
   - `image`
   - `stock`
   - `available`

5. **clothes**
   - `id` (Primary Key)
   - `name`
   - `category`
   - `price`
   - `color`
   - `image`

6. **cart**
   - `id` (Primary Key)
   - `user_id` (Foreign Key → users)

7. **cart_items**
   - `id` (Primary Key)
   - `cart_id` (Foreign Key → cart)
   - `product_id`
   - `product_type` (supplement/clothes)
   - `name`
   - `price`
   - `qty`

8. **orders**
   - `id` (Primary Key)
   - `user_id` (Foreign Key → users)
   - `total`
   - `payment_method`
   - `created_at`

9. **order_items**
   - `id` (Primary Key)
   - `order_id` (Foreign Key → orders)
   - `product_name`
   - `quantity`
   - `price`

### Relationships
- **Users ↔ Orders**: One-to-Many (One user can have many orders)
- **Users ↔ Bookings**: One-to-Many (One user can have many bookings)
- **Coaches ↔ Bookings**: One-to-Many (One coach can have many bookings)
- **Cart ↔ Cart Items**: One-to-Many (One cart can have many items)
- **Orders ↔ Order Items**: One-to-Many (One order can have many items)

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- Git
- npm or yarn

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/AwesomenessMoMo/BiToTri.git
   cd "Bi To Tri Gym"
   ```

2. **Navigate to backend directory**
   ```bash
   cd src/backend
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

4. **Create `.env` file** in `src/backend/` directory:
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

5. **Create MySQL database**
   ```sql
   CREATE DATABASE bitotri;
   ```

6. **Import database schema** (if you have a SQL file):
   ```bash
   mysql -u root -p bitotri < bitotri.sql
   ```

7. **Start the backend server**
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

   The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory** (from project root)
   ```bash
   cd src/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file** in `src/frontend/` directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

   The frontend will run on `http://localhost:3000`

### Database Setup (Manual)

If you don't have a SQL file, create tables manually:

```sql
-- Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user'
);

-- Coaches table
CREATE TABLE coaches (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  specialty VARCHAR(255),
  bio TEXT,
  image VARCHAR(255)
);

-- Coach bookings table
CREATE TABLE coach_bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  coach_id INT NOT NULL,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (coach_id) REFERENCES coaches(id)
);

-- Supplements table
CREATE TABLE supplements (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(255),
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image VARCHAR(255),
  stock INT DEFAULT 0,
  available INT DEFAULT 1
);

-- Clothes table
CREATE TABLE clothes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(255),
  price DECIMAL(10,2) NOT NULL,
  color VARCHAR(100),
  image VARCHAR(255)
);

-- Cart table
CREATE TABLE cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL
);

-- Cart items table
CREATE TABLE cart_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  cart_id INT NOT NULL,
  product_id INT NOT NULL,
  product_type VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  qty INT DEFAULT 1,
  FOREIGN KEY (cart_id) REFERENCES cart(id)
);

-- Orders table
CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Order items table
CREATE TABLE order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id)
);
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/login` - Alternative login endpoint

### Coaches
- `GET /api/coaches` - Get all coaches
- `POST /api/admin/coaches` - Create coach (Admin only)
- `DELETE /api/admin/coaches/:id` - Delete coach (Admin only)
- `PUT /api/admin/coaches/:id/image` - Update coach image (Admin only)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/user/bookings/:userId` - Get user bookings
- `DELETE /api/user/bookings/:bookingId/:userId` - Cancel booking
- `GET /api/admin/bookings` - Get all bookings (Admin only)
- `PUT /api/admin/bookings/:id` - Update booking status (Admin only)

### Products
- `GET /api/supplements` - Get all supplements
- `GET /api/supplements/:id` - Get supplement by ID
- `POST /api/admin/supplements` - Create supplement (Admin only)
- `DELETE /api/admin/supplements/:id` - Delete supplement (Admin only)
- `PUT /api/admin/supplements/:id/image` - Update supplement image (Admin only)

- `GET /api/clothes` - Get all clothes
- `GET /api/clothes/:id` - Get clothing item by ID
- `POST /api/admin/clothes` - Create clothing item (Admin only)
- `DELETE /api/admin/clothes/:id` - Delete clothing item (Admin only)
- `PUT /api/admin/clothes/:id/image` - Update clothing image (Admin only)

### Cart
- `POST /api/cart` - Add item to cart
- `GET /api/cart/:userId` - Get user cart
- `PUT /api/cart/remove-one` - Decrease item quantity
- `DELETE /api/cart/:userId/:productId` - Remove item from cart

### Orders
- `POST /api/checkout` - Create order

### Search
- `GET /api/search?q=query` - Global search

### Health Check
- `GET /api/health` - Check backend and database status

## 💻 Code Snippets

### User Authentication with Password Hashing

```javascript
// src/backend/controllers/authController.js
const bcrypt = require("bcryptjs");

exports.register = (req, res) => {
    const { name, email, password } = req.body;
    
    // Validate input
    if (!name || !email || !password) {
        return res.status(400).json({ message: "Name, email, and password are required" });
    }
    
    // Check if email exists
    db.query("SELECT id FROM users WHERE LOWER(email) = ?", [email.toLowerCase()], (err, result) => {
        if (result.length > 0) {
            return res.status(409).json({ message: "Email already exists" });
        }
        
        // Hash password
        bcrypt.hash(password, 10, (err, hash) => {
            db.query(
                "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'user')",
                [name, email, hash],
                (err, result) => {
                    res.json({
                        user: { id: result.insertId, name, email, role: 'user' },
                        token: null
                    });
                }
            );
        });
    });
};
```

### CRUD Operations Example (Coaches)

```javascript
// Create Coach
app.post("/api/admin/coaches", upload.single("image"), (req, res) => {
    const { name, specialty, bio } = req.body;
    const image = req.file ? req.file.filename : null;
    
    db.query(
        "INSERT INTO coaches (name, specialty, image) VALUES (?, ?, ?)",
        [name, specialty, image],
        (err) => {
            if (err) return res.status(500).json({ message: "Insert failed" });
            res.json({ success: true });
        }
    );
});

// Read Coaches
app.get("/api/coaches", (req, res) => {
    db.query("SELECT * FROM coaches", (err, r) => {
        if (err) return res.status(500).json({ error: "Failed to fetch coaches" });
        res.json(r);
    });
});

// Update Coach Image
app.put("/api/admin/coaches/:id/image", upload.single("image"), (req, res) => {
    const image = req.file?.filename;
    if (!image) return res.status(400).json({ message: "No image" });
    
    db.query(
        "UPDATE coaches SET image=? WHERE id=?",
        [image, req.params.id],
        err => err ? res.status(500).json({ message: "Update failed" }) : res.json({ success: true })
    );
});

// Delete Coach
app.delete("/api/admin/coaches/:id", (req, res) => {
    db.query("DELETE FROM coaches WHERE id=?", [req.params.id], (err) => {
        if (err) return res.status(500).json({ message: "Delete failed" });
        res.json({ success: true });
    });
});
```

### Database Connection with Error Handling

```javascript
// src/backend/config/db.js
const mysql = require("mysql2");

const db = mysql.createPool({
    host: process.env.MYSQL_HOST || "localhost",
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
    database: process.env.MYSQL_DATABASE || "bitotri",
    port: parseInt(process.env.MYSQL_PORT || "3306"),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection
db.getConnection((err, connection) => {
    if (err) {
        console.error("❌ Database connection failed:", err.message);
    } else {
        console.log("✅ Database connected successfully");
        connection.release();
    }
});

module.exports = db;
```

### CORS Configuration

```javascript
// src/backend/server.js
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || process.env.NODE_ENV !== 'production') {
            return callback(null, true);
        }
        // Check allowed origins
        const allowedOrigins = [
            process.env.CLIENT_URL,
            "https://bitotri-frontend-production.up.railway.app"
        ];
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(null, true); // Allow for development
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH']
}));
```

## 🚢 Deployment

### Railway Deployment

The application is deployed on Railway for both backend and frontend.

#### Backend Deployment
1. Connect your GitHub repository to Railway
2. Set root directory to `src/backend`
3. Add environment variables:
   - `MYSQL_HOST`
   - `MYSQL_USER`
   - `MYSQL_PASSWORD`
   - `MYSQL_DATABASE`
   - `MYSQL_PORT`
   - `CLIENT_URL` (frontend URL)
4. Railway will automatically detect Node.js and deploy

#### Frontend Deployment
1. Create a new Railway service
2. Set root directory to `src/frontend`
3. Add environment variable:
   - `REACT_APP_API_URL` (backend URL)
4. Railway will build and serve the React app

### Live URLs
- **Frontend**: https://bitotri-frontend-production.up.railway.app
- **Backend**: https://bitotri-production.up.railway.app

## 📸 Screenshots

> **Note**: Add screenshots of your application here. Include:
> - Home page
> - Login/Signup pages
> - Store pages (Supplements, Clothes)
> - Coach booking interface
> - Admin dashboard
> - Cart and checkout
> - Mobile responsive views

### Example Screenshot Structure:
```
## Screenshots

### Home Page
![Home Page](./screenshots/home.png)

### Store - Supplements
![Supplements](./screenshots/supplements.png)

### Coach Booking
![Booking](./screenshots/booking.png)

### Admin Dashboard
![Admin](./screenshots/admin.png)
```

## 🔮 Future Scope

- [ ] Email notifications for bookings and orders
- [ ] SMS notifications via Twilio
- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] User profile management
- [ ] Review and rating system
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Real-time chat support
- [ ] Social media integration
- [ ] Multi-language support

## 📝 License

This project is for educational purposes.

## 👤 Author

**Mohamad el Masri**

- GitHub: [@AwesomenessMoMo](https://github.com/AwesomenessMoMo)
- Project Link: [https://github.com/AwesomenessMoMo/BiToTri](https://github.com/AwesomenessMoMo/BiToTri)

## 🙏 Acknowledgments

- React.js community
- Express.js documentation
- Material-UI components
- Railway for hosting services

---

**Built with ❤️ using Node.js and React.js**
