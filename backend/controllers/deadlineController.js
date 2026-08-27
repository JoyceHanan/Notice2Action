const Deadline =
  require("../models/Deadline");

const {
  successResponse,
  errorResponse
} = require("../utils/responseUtils");

const getDeadlines = async (
  req,
  res,
  next
) => {
  try {
    const deadlines =
      await Deadline.find({
        user: req.user._id,
        notice: req.params.id
      }).sort({
        date: 1
      });

    const now = new Date();

    for (const deadline of deadlines) {
      if (
        deadline.date &&
        new Date(deadline.date) < now &&
        deadline.status === "upcoming"
      ) {
        deadline.status = "overdue";
        await deadline.save();
      }
    }

    return successResponse(
      res,
      deadlines
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDeadlines
};