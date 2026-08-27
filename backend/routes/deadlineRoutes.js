const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");
const { getDeadlines } = require("../controllers/deadlineController");

router.get("/notice/:id", protect, getDeadlines);

module.exports = router;
