const Roadmap =
  require("../models/Roadmap");

const {
  successResponse,
  errorResponse
} = require("../utils/responseUtils");

const getRoadmap = async (
  req,
  res,
  next
) => {
  try {
    const roadmap =
      await Roadmap.findOne({
        user: req.user._id,
        notice: req.params.id
      });

    if (!roadmap) {
      return errorResponse(
        res,
        "Roadmap not found",
        404
      );
    }

    return successResponse(
      res,
      roadmap
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRoadmap
};