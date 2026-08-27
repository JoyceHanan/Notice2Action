const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");
const { getProfile, updateProfile } = require("../controllers/authController");

router.get("/", protect, getProfile);
router.put("/", protect, updateProfile);

module.exports = router;
