const express = require("express");
const router = express.Router();
const protect = require("../middlewares/authMiddleware");
const { getTasks, updateTask } = require("../controllers/checklistController");

router.get("/notice/:id", protect, getTasks);
router.patch("/:taskId", protect, updateTask);

module.exports = router;
