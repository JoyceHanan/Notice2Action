const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const {
  uploadNotice,
  analyzeExistingNotice,
  getNotices,
  getNotice,
  deleteNotice
} = require("../controllers/noticeController");

const {
  sendMessage,
  getChat
} = require("../controllers/chatController");

// Upload notice file (PDF/DOCX/TXT) and trigger AI analysis
router.post("/upload", protect, upload.single("notice"), uploadNotice);

// Get all notices for logged in user
router.get("/", protect, getNotices);

// Get single notice by ID
router.get("/:id", protect, getNotice);

// Re-analyze existing notice
router.post("/:id/analyze", protect, analyzeExistingNotice);

// Chat / Ask AI question about notice
router.post("/:id/chat", protect, sendMessage);
router.get("/:id/chat", protect, getChat);

// Delete notice
router.delete("/:id", protect, deleteNotice);

module.exports = router;
