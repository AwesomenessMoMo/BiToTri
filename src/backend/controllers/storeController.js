const db = require("../config/db");

exports.getItems = (req, res) => {
    db.query("SELECT * FROM store_items", (err, rows) => {
        if (err) return res.json({ error: err });
        res.json(rows);
    });
};
