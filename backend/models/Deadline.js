const mongoose = require("mongoose");

const deadlineSchema = new mongoose.Schema(
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
    title: {
      type: String,
      required: true,
      default: "Deadline"
    },
    type: {
      type: String,
      default: "other"
    },
    date: {
      type: Date
    },
    priority: {
      type: String,
      default: "medium"
    },
    status: {
      type: String,
      enum: ["upcoming", "overdue", "completed"],
      default: "upcoming"
    },
    sourceText: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Deadline", deadlineSchema);
