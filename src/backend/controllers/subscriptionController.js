const db = require("../config/db");

exports.subscribe = (req, res) => {
    const { user_id, plan_name, price, duration } = req.body;

    db.query(
        "INSERT INTO subscriptions (user_id, plan_name, price, duration) VALUES (?, ?, ?, ?)",
        [user_id, plan_name, price, duration],
        (err) => {
            if (err) return res.json({ error: err });
            res.json({ message: "Subscription added" });
        }
    );
};
