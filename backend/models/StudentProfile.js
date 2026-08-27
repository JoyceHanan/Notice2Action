const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    college: {
      type: String,
      trim: true
    },

    degree: {
      type: String,
      trim: true
    },

    branch: {
      type: String,
      trim: true
    },

    year: {
      type: Number
    },

    CGPA: {
      type: Number,
      min: 0
    },

    backlogs: {
      type: Number,
      min: 0,
      default: 0
    },

    skills: [
      {
        type: String,
        trim: true
      }
    ],

    graduationYear: {
      type: Number
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "StudentProfile",
  studentProfileSchema
);