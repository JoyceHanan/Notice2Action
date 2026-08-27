const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");
const { getRoadmap } = require("../controllers/roadmapController");

router.get("/notice/:id", protect, getRoadmap);

module.exports = router;
