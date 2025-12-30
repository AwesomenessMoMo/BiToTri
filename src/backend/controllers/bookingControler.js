const db = require("../config/db");

exports.bookSession = (req, res) => {
    const { user_id, coach_name, date, time } = req.body;

    db.query(
        "INSERT INTO bookings (user_id, coach_name, date, time) VALUES (?, ?, ?, ?)",
        [user_id, coach_name, date, time],
        (err) => {
            if (err) return res.json({ error: err });
            res.json({ message: "Booking successful" });
        }
    );
};
