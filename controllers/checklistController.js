const Task = require("../models/Task");

const {
  successResponse,
  errorResponse
} = require("../utils/responseUtils");

const getTasks = async (
  req,
  res,
  next
) => {
  try {
    const tasks =
      await Task.find({
        user: req.user._id,
        notice: req.params.id
      })
        .populate(
          "dependsOn",
          "title status"
        )
        .sort({
          order: 1
        });

    return successResponse(
      res,
      tasks
    );
  } catch (error) {
    next(error);
  }
};

const updateTask = async (
  req,
  res,
  next
) => {
  try {
    const task =
      await Task.findOne({
        _id: req.params.taskId,
        user: req.user._id
      }).populate(
        "dependsOn",
        "status title"
      );

    if (!task) {
      return errorResponse(
        res,
        "Task not found",
        404
      );
    }

    const {
      status
    } = req.body;

    if (
      ![
        "pending",
        "in_progress",
        "completed"
      ].includes(status)
    ) {
      return errorResponse(
        res,
        "Invalid task status",
        400
      );
    }

    if (status === "completed") {
      const blocked =
        task.dependsOn.some(
          (dependency) =>
            dependency.status !==
            "completed"
        );

      if (blocked) {
        return errorResponse(
          res,
          "Complete dependent tasks first",
          400
        );
      }
    }

    task.status = status;

    await task.save();

    return successResponse(
      res,
      task,
      "Task updated"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  updateTask
};