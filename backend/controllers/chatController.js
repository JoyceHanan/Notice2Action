const Chat =
  require("../models/Chat");

const Notice =
  require("../models/Notice");

const StudentProfile =
  require("../models/StudentProfile");

const {
  askNotice
} = require("../services/ai/aiService");

const {
  successResponse,
  errorResponse
} = require("../utils/responseUtils");

const sendMessage = async (
  req,
  res,
  next
) => {
  try {
    const {
      question
    } = req.body;

    if (
      !question ||
      !question.trim()
    ) {
      return errorResponse(
        res,
        "Question is required",
        400
      );
    }

    const notice =
      await Notice.findOne({
        _id: req.params.id,
        user: req.user._id
      });

    if (!notice) {
      return errorResponse(
        res,
        "Notice not found",
        404
      );
    }

    const studentProfile =
      await StudentProfile.findOne({
        user: req.user._id
      });

    let chat =
      await Chat.findOne({
        user: req.user._id,
        notice: notice._id
      });

    if (!chat) {
      chat = await Chat.create({
        user: req.user._id,
        notice: notice._id,
        messages: []
      });
    }

    const history =
      chat.messages || [];

    const answer =
      await askNotice({
        noticeText:
          notice.originalText,
        question:
          question.trim(),
        studentProfile,
        history
      });

    chat.messages.push({
      role: "user",
      content:
        question.trim()
    });

    chat.messages.push({
      role: "assistant",
      content: answer
    });

    await chat.save();

    return successResponse(
      res,
      {
        answer,
        chat
      }
    );
  } catch (error) {
    next(error);
  }
};

const getChat = async (
  req,
  res,
  next
) => {
  try {
    const chat =
      await Chat.findOne({
        user: req.user._id,
        notice: req.params.id
      });

    return successResponse(
      res,
      chat || {
        messages: []
      }
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendMessage,
  getChat
};