const mongoose = require("mongoose");

const reminderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    notice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Notice",
      required: true,
      index: true,
    },

    // Optional: reminder can be associated with a deadline
    deadline: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Deadline",
      default: null,
    },

    // Optional: reminder can be associated with a task
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      default: null,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      trim: true,
    },

    reminderTime: {
      type: Date,
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: [
        "deadline",
        "task",
        "application",
        "submission",
        "exam",
        "interview",
        "event",
        "custom",
      ],
      default: "custom",
    },

    // How the reminder should be delivered
    channel: {
      type: String,
      enum: ["email", "in_app", "both"],
      default: "in_app",
    },

    status: {
      type: String,
      enum: ["pending", "sent", "cancelled", "failed"],
      default: "pending",
      index: true,
    },

    sentAt: {
      type: Date,
      default: null,
    },

    // Prevent duplicate reminder creation
    isRecurring: {
      type: Boolean,
      default: false,
    },

    recurrence: {
      type: String,
      enum: ["none", "daily", "weekly"],
      default: "none",
    },
  },
  {
    timestamps: true,
  }
);

// Useful for finding reminders that need to be sent
reminderSchema.index({
  status: 1,
  reminderTime: 1,
});

module.exports = mongoose.model("Reminder", reminderSchema);