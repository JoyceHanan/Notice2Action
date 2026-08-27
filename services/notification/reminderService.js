const Reminder = require("../../models/Reminder");
const User = require("../../models/User");

const processReminders = async () => {
  const now = new Date();

  const reminders = await Reminder.find({
    status: "pending",
    reminderTime: {
      $lte: now
    }
  }).populate("user");

  for (const reminder of reminders) {
    try {

      reminder.status = "sent";

      await reminder.save();
    } catch (error) {
      console.error(
        "Reminder processing failed:",
        error.message
      );
    }
  }
};

const startReminderWorker = () => {
  setInterval(
    processReminders,
    60 * 1000
  );

  console.log(
    "Reminder worker started"
  );
};

module.exports = {
  processReminders,
  startReminderWorker
};