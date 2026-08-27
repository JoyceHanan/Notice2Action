const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");
const { sendMessage, getChat } = require("../controllers/chatController");

router.post("/notice/:id", protect, sendMessage);
router.get("/notice/:id", protect, getChat);

module.exports = router;
