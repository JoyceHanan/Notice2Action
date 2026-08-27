const express = require("express");

const {
  register,
  login,
  getProfile,
  updateProfile,
} = require("../controllers/authController");

const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
*/

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post("/register", register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post("/login", login);

/**
 * @route   GET /api/auth/profile
 * @desc    Get logged-in user's profile
 * @access  Private
 */
router.get("/profile", authMiddleware, getProfile);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update logged-in user's profile
 * @access  Private
 */
router.put("/profile", authMiddleware, updateProfile);

module.exports = router;