const mongoose = require("mongoose");

const eligibilitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    notice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Notice",
      required: true
    },

    status: {
      type: String,
      enum: [
        "eligible",
        "partially_eligible",
        "not_eligible",
        "unknown"
      ],
      default: "unknown"
    },

    reasons: [String],

    requirements: {
      branches: [String],
      minimumCGPA: Number,
      maximumBacklogs: Number,
      requiredSkills: [String],
      year: mongoose.Schema.Types.Mixed,
      degree: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "Eligibility",
  eligibilitySchema
);