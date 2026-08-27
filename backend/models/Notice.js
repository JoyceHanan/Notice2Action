const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    title: {
      type: String,
      default: "Untitled Notice"
    },

    originalText: {
      type: String,
      required: true
    },

    fileName: {
      type: String
    },

    fileUrl: {
      type: String
    },

    summary: {
      type: String,
      default: ""
    },

    importantPoints: [
      {
        type: String
      }
    ],

    eligibility: {
      type: mongoose.Schema.Types.Mixed,
      default: {
        status: "unknown",
        reasons: [],
        requirements: {}
      }
    },

    deadlines: [
      {
        type: mongoose.Schema.Types.Mixed
      }
    ],

    tasks: [
      {
        type: mongoose.Schema.Types.Mixed
      }
    ],

    roadmap: [
      {
        type: mongoose.Schema.Types.Mixed
      }
    ],

    nextBestAction: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },

    warnings: [
      {
        type: mongoose.Schema.Types.Mixed
      }
    ],

    missingInformation: [
      {
        type: String
      }
    ],

    confidence: {
      type: Number,
      default: 0.9
    },

    analysisStatus: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending"
    },

    analysisError: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Notice", noticeSchema);