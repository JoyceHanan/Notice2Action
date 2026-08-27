const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
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
      required: true
    },
    description: {
      type: String,
      default: ""
    },
    priority: {
      type: String,
      default: "medium"
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed"],
      default: "pending"
    },
    order: {
      type: Number,
      default: 0
    },
    dependsOn: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Task"
      }
    ],
    deadline: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Task", taskSchema);
