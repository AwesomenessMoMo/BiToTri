const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = (req, res) => {
    const { name, email, password } = req.body;

    bcrypt.hash(password, 10, (err, hash) => {
        db.query(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            [name, email, hash],
            (err) => {
                if (err) return res.json({ error: err });
                res.json({ message: "User registered successfully" });
            }
        );
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
        if (err || result.length === 0) return res.json({ error: "User not found" });

        const user = result[0];

        bcrypt.compare(password, user.password, (err, match) => {
            if (!match) return res.json({ error: "Wrong credentials" });

            const token = jwt.sign({ id: user.id }, "SECRET123", { expiresIn: "1d" });

            res.json({ message: "Login success", token });
        });
    });
};
