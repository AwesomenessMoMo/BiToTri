const express = require("express");
const cors = require("cors");
const path = require("path");
const multer = require("multer");
const db = require("./config/db");

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const app = express();

// CORS must be configured BEFORE any routes
const allowedOrigins = [
    process.env.CLIENT_URL,
    process.env.RAILWAY_PUBLIC_DOMAIN,
    process.env.FRONTEND_URL,
    "https://bitotri-frontend-production.up.railway.app",
    "http://localhost:3000"
].filter(Boolean); 

// CORS configuration - MUST be before any routes to handle preflight OPTIONS requests
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) {
            return callback(null, true);
        }

        // In development, allow all origins
        if (process.env.NODE_ENV !== 'production') {
            return callback(null, true);
        }

        // Check exact match first
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        // Check domain match (handle Railway subdomains)
        const originDomain = origin.replace(/^https?:\/\//, '').toLowerCase();
        const isAllowed = allowedOrigins.some(allowed => {
            if (!allowed) return false;
            const allowedDomain = allowed.replace(/^https?:\/\//, '').toLowerCase();
            return originDomain === allowedDomain;
        });

        if (isAllowed) {
            return callback(null, true);
        }

        // Log the issue but allow to prevent blocking
        console.warn('CORS: Origin not in allowed list:', origin);
        console.warn('Allowed origins:', allowedOrigins);
        callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: [],
    preflightContinue: false,
    optionsSuccessStatus: 204
}));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const fs = require("fs");

if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        const uniqueName =
            Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });

app.get("/", (req, res) => {
    res.send("Bi To Tri Backend is running!");
});


app.get("/api/health", (req, res) => {
    db.query("SELECT 1", (err) => {
        if (err) {
            return res.status(500).json({
                status: "error",
                message: "Database connection failed",
                error: err.message
            });
        }
        res.json({
            status: "ok",
            message: "Backend and database are connected",
            timestamp: new Date().toISOString()
        });
    });
});

app.get("/api/supplements", (req, res) => {
    db.query("SELECT * FROM supplements", (err, r) => {
        if (err) {
            console.error("Error fetching supplements:", err);
            return res.status(500).json({ error: "Failed to fetch supplements", message: err.message });
        }
        res.json(r);
    });
});

app.get("/api/supplements/:id", (req, res) => {
    db.query(
        "SELECT * FROM supplements WHERE id = ?",
        [req.params.id],
        (err, rows) => {
            if (err) return res.status(500).json(err);
            if (!rows.length) return res.status(404).json({});
            res.json(rows[0]);
        }
    );
});

app.get("/api/clothes", (req, res) => {
    db.query("SELECT * FROM clothes", (err, r) => {
        if (err) {
            console.error("Error fetching clothes:", err);
            return res.status(500).json({ error: "Failed to fetch clothes", message: err.message });
        }
        res.json(r);
    });
});

app.get("/api/clothes/:id", (req, res) => {
    db.query(
        "SELECT * FROM clothes WHERE id = ?",
        [req.params.id],
        (err, rows) => {
            if (err) return res.status(500).json(err);
            if (!rows.length) return res.status(404).json({});
            res.json(rows[0]);
        }
    );
});

app.get("/api/coaches", (req, res) => {
    db.query("SELECT * FROM coaches", (err, r) => {
        if (err) {
            console.error("Error fetching coaches:", err);
            return res.status(500).json({ error: "Failed to fetch coaches", message: err.message });
        }
        res.json(r);
    });
});

app.post("/api/signup", (req, res) => {
    const { name, email, password } = req.body;

    db.query("SELECT id FROM users WHERE email=?", [email], (err, r) => {
        if (r.length) return res.status(409).json({ message: "Email exists" });

        db.query(
            "INSERT INTO users (name,email,password,role) VALUES (?,?,?,'user')",
            [name, email, password],
            (err, result) =>
                err
                    ? res.status(500).json({ message: "Signup failed" })
                    : res.json({ id: result.insertId, name, email, role: "user" })
        );
    });
});

app.post("/api/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    db.query(
        "SELECT id,name,email,role,password FROM users WHERE LOWER(email)=?",
        [email.toLowerCase()],
        (err, r) => {
            if (err) {
                console.error("Login database error:", err);
                return res.status(500).json({ message: "Database error" });
            }

            if (!r.length || r[0].password !== password) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            res.json({
                user: {
                    id: r[0].id,
                    name: r[0].name,
                    email: r[0].email,
                    role: r[0].role
                },
                token: null // Plain text password auth - no JWT token needed
            });
        }
    );
});

// Also support /api/auth/login endpoint for frontend compatibility
app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }

    db.query(
        "SELECT id,name,email,role,password FROM users WHERE LOWER(email)=?",
        [email.toLowerCase()],
        (err, r) => {
            if (err) {
                console.error("Login database error:", err);
                return res.status(500).json({ message: "Database error" });
            }

            if (!r.length || r[0].password !== password) {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            res.json({
                user: {
                    id: r[0].id,
                    name: r[0].name,
                    email: r[0].email,
                    role: r[0].role
                },
                token: null // Plain text password auth - no JWT token needed
            });
        }
    );
});

app.post("/api/cart", (req, res) => {
    let { user_id, product_id, product_type, name, price } = req.body;

    user_id = String(user_id);
    product_id = Number(product_id);
    price = Number(price);

    if (!user_id || !Number.isInteger(product_id) || !name || isNaN(price)) {
        return res.status(400).json({ error: "Invalid cart payload" });
    }

    db.query("SELECT id FROM cart WHERE user_id=?", [user_id], (err, c) => {
        if (err) return res.status(500).json(err);

        const useCart = cartId => {
            db.query(
                "SELECT id FROM cart_items WHERE cart_id=? AND product_id=?",
                [cartId, product_id],
                (err, i) => {
                    if (err) return res.status(500).json(err);

                    if (i.length) {
                        db.query(
                            "UPDATE cart_items SET qty=qty+1 WHERE id=?",
                            [i[0].id],
                            err =>
                                err
                                    ? res.status(500).json(err)
                                    : res.json({ success: true })
                        );
                    } else {
                        db.query(
                            `INSERT INTO cart_items
                             (cart_id, product_id, product_type, name, price, qty)
                             VALUES (?, ?, ?, ?, ?, 1)`,
                            [cartId, product_id, product_type, name, price],
                            err =>
                                err
                                    ? res.status(500).json(err)
                                    : res.json({ success: true })
                        );
                    }
                }
            );
        };

        if (c.length) {
            useCart(c[0].id);
        } else {
            db.query(
                "INSERT INTO cart (user_id) VALUES (?)",
                [user_id],
                (err, r) => {
                    if (err) return res.status(500).json(err);
                    useCart(r.insertId);
                }
            );
        }
    });
});

app.get("/api/cart/:userId", (req, res) => {
    db.query(
        `
        SELECT 
            ci.product_id,
            ci.product_type,
            ci.name,
            ci.price,
            ci.qty,
            CASE
                WHEN ci.product_type = 'supplement' THEN s.image
                WHEN ci.product_type = 'clothes' THEN cl.image
            END AS image
        FROM cart c
        JOIN cart_items ci ON ci.cart_id = c.id
        LEFT JOIN supplements s 
            ON ci.product_id = s.id AND ci.product_type = 'supplement'
        LEFT JOIN clothes cl 
            ON ci.product_id = cl.id AND ci.product_type = 'clothes'
        WHERE c.user_id = ?
        `,
        [req.params.userId],
        (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).json(err);
            }
            res.json(rows || []);
        }
    );
});

app.put("/api/cart/remove-one", (req, res) => {
    let { user_id, product_id } = req.body;

    user_id = String(user_id);
    product_id = Number(product_id);

    if (!user_id || !Number.isInteger(product_id)) {
        return res.status(400).json({ error: "Invalid payload" });
    }

    db.query("SELECT id FROM cart WHERE user_id=?", [user_id], (err, c) => {
        if (err) return res.status(500).json(err);
        if (!c.length) return res.json({ success: true });

        const cartId = c[0].id;

        db.query(
            "SELECT id, qty FROM cart_items WHERE cart_id=? AND product_id=?",
            [cartId, product_id],
            (err, r) => {
                if (err) return res.status(500).json(err);
                if (!r.length) return res.json({ success: true });

                const itemId = r[0].id;
                const qty = r[0].qty;

                if (qty > 1) {
                    db.query(
                        "UPDATE cart_items SET qty=qty-1 WHERE id=?",
                        [itemId],
                        (err) => (err ? res.status(500).json(err) : res.json({ success: true }))
                    );
                } else {
                    db.query(
                        "DELETE FROM cart_items WHERE id=?",
                        [itemId],
                        (err) => (err ? res.status(500).json(err) : res.json({ success: true }))
                    );
                }
            }
        );
    });
});

app.delete("/api/cart/:userId/:productId", (req, res) => {
    const user_id = String(req.params.userId);
    const product_id = Number(req.params.productId);

    if (!user_id || !Number.isInteger(product_id)) {
        return res.status(400).json({ error: "Invalid params" });
    }

    db.query("SELECT id FROM cart WHERE user_id=?", [user_id], (err, c) => {
        if (err) return res.status(500).json(err);
        if (!c.length) return res.json({ success: true });

        const cartId = c[0].id;

        db.query(
            "DELETE FROM cart_items WHERE cart_id=? AND product_id=?",
            [cartId, product_id],
            (err) => (err ? res.status(500).json(err) : res.json({ success: true }))
        );
    });
});


app.post("/api/checkout", (req, res) => {
    const { user_id, items, total } = req.body;

    db.query(
        "INSERT INTO orders (user_id,total,payment_method) VALUES (?,?,?)",
        [user_id, total, "Mastercard"],
        (err, r) => {
            if (err) return res.status(500).json(err);

            const values = items.map(i => [r.insertId, i.name, i.qty, i.price]);

            db.query(
                "INSERT INTO order_items (order_id,product_name,quantity,price) VALUES ?",
                [values],
                err =>
                    err
                        ? res.status(500).json(err)
                        : res.json({ success: true })
            );
        }
    );
});

app.post("/api/bookings", (req, res) => {
    const { user_id, coach_id, booking_date, booking_time } = req.body;

    db.query(
        "INSERT INTO coach_bookings (user_id,coach_id,booking_date,booking_time) VALUES (?,?,?,?)",
        [user_id, coach_id, booking_date, booking_time],
        err =>
            err ? res.status(500).json(err) : res.json({ success: true })
    );
});
app.get("/api/user/bookings/:userId", (req, res) => {
    const userId = req.params.userId;

    db.query(
        `
    SELECT 
      cb.id,
      cb.booking_date,
      cb.booking_time,
      cb.status,
      c.name AS coach_name
    FROM coach_bookings cb
    JOIN coaches c ON c.id = cb.coach_id
    WHERE cb.user_id = ?
    ORDER BY cb.booking_date DESC
    `,
        [userId],
        (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).json([]);
            }
            res.json(rows || []);
        }
    );
});

app.delete("/api/user/bookings/:bookingId/:userId", (req, res) => {
    const { bookingId, userId } = req.params;

    db.query(
        "DELETE FROM coach_bookings WHERE id = ? AND user_id = ?",
        [bookingId, userId],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false });
            }

            if (result.affectedRows === 0) {
                return res.status(403).json({ success: false });
            }

            res.json({ success: true });
        }
    );
});


app.post("/api/admin/coaches", upload.single("image"), (req, res) => {
    const { name, specialty, bio } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!name || !specialty || !bio) {
        return res.status(400).json({ message: "Missing fields" });
    }

    db.query(
        "INSERT INTO coaches (name, specialty, image) VALUES (?, ?, ?)",
        [name, specialty, image],
        (err) => {
            if (err) {
                console.error("COACH INSERT ERROR:", err);
                return res.status(500).json({ message: "Insert failed" });
            }
            res.json({ success: true });
        }
    );
});
app.delete("/api/admin/coaches/:id", (req, res) => {
    const id = req.params.id;

    db.query(
        "SELECT image FROM coaches WHERE id=?",
        [id],
        (err, r) => {
            if (err) return res.status(500).json(err);

            if (r.length && r[0].image) {
                fs.unlink(path.join(__dirname, "uploads", r[0].image), () => { });
            }

            db.query(
                "DELETE FROM coaches WHERE id=?",
                [id],
                err =>
                    err
                        ? res.status(500).json({ message: "Delete failed" })
                        : res.json({ success: true })
            );
        }
    );
});
app.put("/api/admin/coaches/:id/image", upload.single("image"), (req, res) => {
    const image = req.file?.filename;
    if (!image) return res.status(400).json({ message: "No image" });

    db.query(
        "UPDATE coaches SET image=? WHERE id=?",
        [image, req.params.id],
        err =>
            err
                ? res.status(500).json({ message: "Update failed" })
                : res.json({ success: true })
    );
});


app.post("/api/admin/supplements", upload.single("image"), (req, res) => {
    const { name, category, description, price } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!name || !category || !description || !price) {
        return res.status(400).json({ success: false, message: "Missing fields" });
    }

    db.query(
        `INSERT INTO supplements (name, category, description, price, image)
         VALUES (?, ?, ?, ?, ?)`,
        [name, category, description, price, image],
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false });
            }
            res.json({ success: true });
        }
    );
});
app.delete("/api/admin/supplements/:id", (req, res) => {
    const id = req.params.id;

    db.query(
        "SELECT image FROM supplements WHERE id = ?",
        [id],
        (err, r) => {
            if (err) return res.status(500).json(err);

            if (r.length && r[0].image) {
                const imgPath = path.join(__dirname, "uploads", r[0].image);
                fs.unlink(imgPath, () => { });
            }

            db.query(
                "DELETE FROM supplements WHERE id = ?",
                [id],
                (err) =>
                    err
                        ? res.status(500).json(err)
                        : res.json({ success: true })
            );
        }
    );
});
app.put("/api/admin/supplements/:id/image", upload.single("image"), (req, res) => {
    const image = req.file?.filename;
    if (!image) return res.status(400).json({ message: "No image" });

    db.query(
        "UPDATE supplements SET image=? WHERE id=?",
        [image, req.params.id],
        err =>
            err
                ? res.status(500).json({ message: "Update failed" })
                : res.json({ success: true })
    );
});



app.post("/api/admin/clothes", upload.single("image"), (req, res) => {
    const { name, category, price, color } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!name || !category || !price || !color) {
        return res.status(400).json({ success: false });
    }

    db.query(
        "INSERT INTO clothes (name, category, price, color, image) VALUES (?, ?, ?, ?, ?)",
        [name, category, price, color, image],
        err =>
            err
                ? res.status(500).json({ success: false })
                : res.json({ success: true })
    );
});


app.delete("/api/admin/clothes/:id", (req, res) => {
    const id = req.params.id;

    db.query(
        "SELECT image FROM clothes WHERE id = ?",
        [id],
        (err, r) => {
            if (err) return res.status(500).json(err);

            if (r.length && r[0].image) {
                const imgPath = path.join(__dirname, "uploads", r[0].image);
                fs.unlink(imgPath, () => { });
            }

            db.query(
                "DELETE FROM clothes WHERE id = ?",
                [id],
                (err) =>
                    err
                        ? res.status(500).json(err)
                        : res.json({ success: true })
            );
        }
    );
});
app.put("/api/admin/clothes/:id/image", upload.single("image"), (req, res) => {
    const image = req.file?.filename;
    if (!image) return res.status(400).json({ message: "No image" });

    db.query(
        "UPDATE clothes SET image=? WHERE id=?",
        [image, req.params.id],
        err =>
            err
                ? res.status(500).json({ message: "Update failed" })
                : res.json({ success: true })
    );
});

app.put("/api/admin/bookings/:id", (req, res) => {
    const { status } = req.body;

    db.query(
        "UPDATE coach_bookings SET status=? WHERE id=?",
        [status, req.params.id],
        (err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "Update failed" });
            }
            res.json({ success: true });
        }
    );
});


app.get("/api/admin/bookings", (req, res) => {
    db.query(
        `SELECT cb.id,u.name user_name,c.name coach_name,cb.booking_date,cb.booking_time,cb.status
         FROM coach_bookings cb
         JOIN users u ON u.id=cb.user_id
         JOIN coaches c ON c.id=cb.coach_id`,
        (err, r) => (err ? res.status(500).json(err) : res.json(r || []))
    );
});

app.get("/api/search", (req, res) => {
    const q = req.query.q?.trim();
    if (!q) return res.json([]);

    const like = `%${q}%`;
    let results = [];
    let done = 0;

    const finish = () => {
        done++;
        if (done === 3) {
            res.json(results.slice(0, 10));
        }
    };

    db.query(
        "SELECT id, name FROM coaches WHERE name LIKE ?",
        [like],
        (err, rows) => {
            if (!err && rows) {
                results.push(
                    ...rows.map(r => ({
                        name: r.name,
                        type: "Coach",
                        path: "/coaches"
                    }))
                );
            }
            finish();
        }
    );

    db.query(
        "SELECT id, name FROM supplements WHERE name LIKE ?",
        [like],
        (err, rows) => {
            if (!err && rows) {
                results.push(
                    ...rows.map(r => ({
                        name: r.name,
                        type: "Supplement",
                        path: "/supplements"
                    }))
                );
            }
            finish();
        }
    );

    db.query(
        "SELECT id, name FROM clothes WHERE name LIKE ?",
        [like],
        (err, rows) => {
            if (!err && rows) {
                results.push(
                    ...rows.map(r => ({
                        name: r.name,
                        type: "Clothes",
                        path: "/clothes"
                    }))
                );
            }
            finish();
        }
    );
});


const PORT = process.env.PORT || 8080;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`CORS allowed origins: ${allowedOrigins.join(', ')}`);
});
