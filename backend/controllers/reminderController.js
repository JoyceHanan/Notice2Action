const Reminder =
  require("../models/Reminder");

const {
  successResponse,
  errorResponse
} = require("../utils/responseUtils");

const getReminders = async (
  req,
  res,
  next
) => {
  try {
    const rawReminders =
      await Reminder.find({
        user: req.user._id
      })
        .populate(
          "notice",
          "title"
        )
        .populate(
          "deadline",
          "title date"
        )
        .populate(
          "task",
          "title status"
        )
        .sort({
          reminderTime: 1
        });

    const seenTitles = new Set();
    const reminders = rawReminders.filter((r) => {
      const key = (r.title || "").toLowerCase().trim();
      if (!key || seenTitles.has(key)) return false;
      seenTitles.add(key);
      return true;
    });

    return successResponse(
      res,
      reminders
    );
  } catch (error) {
    next(error);
  }
};

const createReminder = async (
  req,
  res,
  next
) => {
  try {
    const {
      notice,
      deadline,
      task,
      reminderTime,
      message,
      channel
    } = req.body;

    if (
      !reminderTime ||
      !message
    ) {
      return errorResponse(
        res,
        "reminderTime and message are required",
        400
      );
    }

    const reminder =
      await Reminder.create({
        user: req.user._id,
        notice,
        deadline,
        task,
        reminderTime:
          new Date(reminderTime),
        message,
        channel:
          channel || "in_app"
      });

    return successResponse(
      res,
      reminder,
      "Reminder created",
      201
    );
  } catch (error) {
    next(error);
  }
};

const deleteReminder = async (
  req,
  res,
  next
) => {
  try {
    const reminder =
      await Reminder.findOne({
        _id: req.params.id,
        user: req.user._id
      });

    if (!reminder) {
      return errorResponse(
        res,
        "Reminder not found",
        404
      );
    }

    reminder.status =
      "cancelled";

    await reminder.save();

    return successResponse(
      res,
      reminder,
      "Reminder cancelled"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getReminders,
  createReminder,
  deleteReminder
};