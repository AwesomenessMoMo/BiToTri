const db = require("../config/db");

exports.globalSearch = (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.json([]);
    }

    const likeQuery = `%${query}%`;

    const sql = `
        SELECT name, 'coach' AS type, '/coaches' AS path
        FROM users
        WHERE role = 'coach' AND name LIKE ?

        UNION

        SELECT name, 'supplement' AS type, '/supplements' AS path
        FROM supplements
        WHERE name LIKE ?

        UNION

        SELECT name, 'clothes' AS type, '/clothes' AS path
        FROM clothes
        WHERE name LIKE ?
    `;

    db.query(sql, [likeQuery, likeQuery, likeQuery], (err, results) => {
        if (err) {
            console.error("Search error:", err);
            return res.status(500).json({ message: "Search failed" });
        }

        res.json(results);
    });
};
