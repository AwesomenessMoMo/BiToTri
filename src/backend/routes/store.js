const express = require("express");
const { getItems } = require("../controllers/storeController");
const router = express.Router();

router.get("/items", getItems);

module.exports = router;
