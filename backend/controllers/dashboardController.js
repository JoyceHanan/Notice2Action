const Notice = require("../models/Notice");
const Deadline = require("../models/Deadline");
const Task = require("../models/Task");
const User = require("../models/User");
const { successResponse } = require("../utils/responseUtils");

const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const userDoc = await User.findById(userId).select("name email college branch year");

    // Fetch user notices
    const allNotices = await Notice.find({ user: userId }).sort({ createdAt: -1 });

    // Show only the 1 latest active notice with full content
    const notices = allNotices.slice(0, 1);

    // Fetch upcoming deadlines and deduplicate by title
    const rawDeadlines = await Deadline.find({ user: userId }).sort({ date: 1 });
    const seenDeadlines = new Set();
    const deadlines = rawDeadlines.filter((dl) => {
      const key = (dl.title || "").toLowerCase().trim();
      if (!key || seenDeadlines.has(key)) return false;
      seenDeadlines.add(key);
      return true;
    });

    // Fetch action checklist tasks and deduplicate by title
    const rawTasks = await Task.find({ user: userId }).sort({ order: 1, createdAt: 1 });
    const seenTasks = new Set();
    const tasks = rawTasks.filter((t) => {
      const key = (t.title || "").toLowerCase().trim();
      if (!key || seenTasks.has(key)) return false;
      seenTasks.add(key);
      return true;
    });

    // Calculate stats
    const totalNotices = allNotices.length;
    const completedTasks = tasks.filter((t) => t.status === "completed").length;
    const pendingTasks = tasks.filter((t) => t.status !== "completed").length;
    const progress = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

    // Determine Next Best Action
    let nextBestAction = null;
    const pendingTask = tasks.find((t) => t.status !== "completed");
    if (pendingTask) {
      nextBestAction = {
        title: pendingTask.title,
        reason: pendingTask.description || "Incomplete action item from your notice",
        priority: pendingTask.priority || "high",
        noticeId: pendingTask.notice,
      };
    } else if (notices.length > 0 && notices[0].nextBestAction?.title) {
      nextBestAction = {
        title: notices[0].nextBestAction.title,
        reason: notices[0].nextBestAction.reason || "Recommended next step",
        priority: notices[0].nextBestAction.priority || "high",
        noticeId: notices[0]._id,
      };
    }

    return successResponse(res, {
      user: userDoc || { name: req.user.name },
      notices,
      deadlines,
      tasks,
      stats: {
        totalNotices,
        completedTasks,
        pendingTasks,
        progress,
      },
      nextBestAction,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDashboard };
