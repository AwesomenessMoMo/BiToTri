const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) return res.json({ error: "Missing token" });

  jwt.verify(token, "SECRET123", (err, decoded) => {
    if (err) return res.json({ error: "Invalid token" });
    req.user_id = decoded.id;
    next();
  });
};