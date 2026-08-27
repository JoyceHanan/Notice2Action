const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");


/*
|--------------------------------------------------------------------------
| Generate JWT
|--------------------------------------------------------------------------
*/

const generateToken = (userId) => {
  return jwt.sign(
    {
      id: userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );
};

/*
|--------------------------------------------------------------------------
| Remove sensitive fields from user
|--------------------------------------------------------------------------
*/

const sanitizeUser = (user) => {
  const userObject = user.toObject ? user.toObject() : { ...user };

  delete userObject.password;
  delete userObject.__v;

  return userObject;
};

/*
|--------------------------------------------------------------------------
| REGISTER
|--------------------------------------------------------------------------
| POST /api/auth/register
|--------------------------------------------------------------------------
*/

const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      year,
      branch,
      cgpa,
      backlogs,
      skills,
      phone,
      college,
    } = req.body;

    /*
    |--------------------------------------------------------------------------
    | Validation
    |--------------------------------------------------------------------------
    */

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 6 characters.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Normalize email
    |--------------------------------------------------------------------------
    */

    const normalizedEmail = email.trim().toLowerCase();

    /*
    |--------------------------------------------------------------------------
    | Check existing user
    |--------------------------------------------------------------------------
    */

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Hash password
    |--------------------------------------------------------------------------
    */

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    /*
    |--------------------------------------------------------------------------
    | Create user
    |--------------------------------------------------------------------------
    */

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,

      phone: phone || "",

      college: college || "",

      year: year || null,

      branch: branch || "",

      cgpa: cgpa !== undefined && cgpa !== "" ? Number(cgpa) : null,

      backlogs:
        backlogs !== undefined && backlogs !== ""
          ? Number(backlogs)
          : 0,

      skills: Array.isArray(skills) ? skills : [],
    });

    /*
    |--------------------------------------------------------------------------
    | Generate token
    |--------------------------------------------------------------------------
    */

    const token = generateToken(user._id);



    /*
    |--------------------------------------------------------------------------
    | Response
    |--------------------------------------------------------------------------
    */

    return res.status(201).json({
      success: true,
      message: "Registration successful.",
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
| POST /api/auth/login
|--------------------------------------------------------------------------
*/

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    /*
    |--------------------------------------------------------------------------
    | Validation
    |--------------------------------------------------------------------------
    */

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    /*
    |--------------------------------------------------------------------------
    | Find user
    |--------------------------------------------------------------------------
    |
    | Explicitly select password because User.js may hide it.
    |--------------------------------------------------------------------------
    */

    const user = await User.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Compare password
    |--------------------------------------------------------------------------
    */

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Generate JWT
    |--------------------------------------------------------------------------
    */

    const token = generateToken(user._id);

    /*
    |--------------------------------------------------------------------------
    | Response
    |--------------------------------------------------------------------------
    */

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: sanitizeUser(user),
    });
  } catch (error) {
    next(error);
  }
};

/*
|--------------------------------------------------------------------------
| GET PROFILE
|--------------------------------------------------------------------------
| GET /api/auth/profile
|--------------------------------------------------------------------------
*/

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id || req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const sanitized = sanitizeUser(user);

    return res.status(200).json({
      success: true,
      user: sanitized,
      data: sanitized,
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const {
      name,
      phone,
      college,
      year,
      branch,
      cgpa,
      backlogs,
      skills,
    } = req.body;

    const user = await User.findById(req.user._id || req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (name !== undefined) {
      user.name = String(name).trim();
    }

    if (phone !== undefined) {
      user.phone = phone;
    }

    if (college !== undefined) {
      user.college = college;
    }

    if (year !== undefined) {
      user.year = year;
    }

    if (branch !== undefined) {
      user.branch = branch;
    }

    if (cgpa !== undefined && cgpa !== "") {
      const parsedCgpa = Number(cgpa);
      if (!Number.isNaN(parsedCgpa)) {
        user.cgpa = parsedCgpa;
      }
    }

    if (backlogs !== undefined && backlogs !== "") {
      const parsedBacklogs = Number(backlogs);
      if (!Number.isNaN(parsedBacklogs) && parsedBacklogs >= 0) {
        user.backlogs = parsedBacklogs;
      }
    }

    if (skills !== undefined) {
      let skillsArray = [];
      if (Array.isArray(skills)) {
        skillsArray = skills;
      } else if (typeof skills === "string") {
        skillsArray = skills.split(",").map((s) => s.trim()).filter(Boolean);
      }
      user.skills = skillsArray;
    }

    await user.save();

    const sanitized = sanitizeUser(user);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: sanitized,
      data: sanitized,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
};