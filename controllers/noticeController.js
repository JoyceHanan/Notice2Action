const fs = require("fs");
const path = require("path");

const Notice = require("../models/Notice");
const Eligibility =
  require("../models/Eligibility");
const Deadline =
  require("../models/Deadline");
const Task = require("../models/Task");
const Roadmap =
  require("../models/Roadmap");
const StudentProfile =
  require("../models/StudentProfile");

const parsePDF =
  require("../services/document/pdfParser");

const parseDOCX =
  require("../services/document/docParser");

const {
  analyzeNotice
} = require("../services/ai/aiService");

const {
  successResponse,
  errorResponse
} = require("../utils/responseUtils");

const extractText = async (file) => {
  const extension =
    path.extname(
      file.originalname
    ).toLowerCase();

  if (extension === ".pdf") {
    return parsePDF(file.path);
  }

  if (extension === ".docx") {
    return parseDOCX(file.path);
  }

  if (extension === ".txt") {
    return fs.readFileSync(
      file.path,
      "utf8"
    );
  }

  throw new Error(
    "Unsupported file type"
  );
};

const createAnalysisRecords = async ({
  userId,
  notice,
  analysis
}) => {
  await Eligibility.findOneAndUpdate(
    {
      user: userId,
      notice: notice._id
    },
    {
      user: userId,
      notice: notice._id,
      status:
        analysis.eligibility.status,
      reasons:
        analysis.eligibility.reasons || [],
      requirements:
        analysis.eligibility.requirements || {}
    },
    {
      upsert: true,
      new: true
    }
  );

  await Deadline.deleteMany({
    user: userId,
    notice: notice._id
  });

  await Task.deleteMany({
    user: userId,
    notice: notice._id
  });

  await Roadmap.deleteMany({
    user: userId,
    notice: notice._id
  });

  const deadlines =
    await Deadline.insertMany(
      (analysis.deadlines || []).map(
        (deadline) => ({
          user: userId,
          notice: notice._id,
          title:
            deadline.title ||
            "Deadline",
          type:
            deadline.type ||
            "other",
          date:
            deadline.date
              ? new Date(deadline.date)
              : undefined,
          priority:
            deadline.priority ||
            "medium",
          sourceText:
            deadline.sourceText || ""
        })
      )
    );

  const taskData =
    (analysis.tasks || []).map(
      (task, index) => ({
        user: userId,
        notice: notice._id,
        title:
          task.title ||
          `Task ${index + 1}`,
        description:
          task.description || "",
        priority:
          task.priority ||
          "medium",
        status: "pending",
        order: index,
        dependsOn: [],
        deadline: undefined
      })
    );

  const tasks =
    taskData.length
      ? await Task.insertMany(
          taskData
        )
      : [];

  // Convert AI task indexes into MongoDB task dependencies.
  for (
    let index = 0;
    index < tasks.length;
    index++
  ) {
    const aiTask =
      analysis.tasks[index];

    if (
      Array.isArray(
        aiTask?.dependsOn
      )
    ) {
      const dependencies =
        aiTask.dependsOn
          .map((dependencyIndex) => {
            const dependency =
              tasks[dependencyIndex];

            return dependency
              ? dependency._id
              : null;
          })
          .filter(Boolean);

      tasks[index].dependsOn =
        dependencies;

      await tasks[index].save();
    }
  }

  const roadmap =
    await Roadmap.create({
      user: userId,
      notice: notice._id,
      steps:
        analysis.roadmap || []
    });

  return {
    deadlines,
    tasks,
    roadmap
  };
};

const uploadNotice = async (
  req,
  res,
  next
) => {
  let uploadedFilePath = null;

  try {
    if (!req.file) {
      return errorResponse(
        res,
        "Notice file is required",
        400
      );
    }

    uploadedFilePath =
      req.file.path;

    const text =
      await extractText(req.file);

    if (!text.trim()) {
      return errorResponse(
        res,
        "Could not extract text from the notice",
        400
      );
    }

    const notice =
      await Notice.create({
        user: req.user._id,
        title:
          req.body.title ||
          req.file.originalname,
        originalText: text,
        fileName:
          req.file.originalname,
        fileUrl:
          `/uploads/${req.file.filename}`,
        analysisStatus:
          "processing"
      });

    try {
      const studentProfile =
        await StudentProfile.findOne({
          user: req.user._id
        });

      const analysis =
        await analyzeNotice({
          noticeText: text,
          studentProfile
        });

      notice.title =
        analysis.title ||
        notice.title;

      notice.summary =
        analysis.summary || "";

      notice.importantPoints =
        analysis.importantPoints || [];

      notice.eligibility =
        analysis.eligibility || {
          status: "unknown",
          reasons: [],
          requirements: {}
        };

      notice.deadlines =
        analysis.deadlines || [];

      notice.tasks =
        analysis.tasks || [];

      notice.roadmap =
        analysis.roadmap || [];

      notice.nextBestAction =
        analysis.nextBestAction || {};

      notice.warnings =
        analysis.warnings || [];

      notice.missingInformation =
        analysis.missingInformation || [];

      notice.confidence =
        analysis.confidence;

      notice.analysisStatus =
        "completed";

      notice.analysisError = "";

      await notice.save();

      await createAnalysisRecords({
        userId: req.user._id,
        notice,
        analysis
      });
    } catch (analysisError) {
      notice.analysisStatus =
        "failed";

      notice.analysisError =
        analysisError.message;

      await notice.save();
    }

    const result =
      await Notice.findById(
        notice._id
      );

    return successResponse(
      res,
      result,
      notice.analysisStatus ===
        "completed"
        ? "Notice analyzed successfully"
        : "Notice uploaded but AI analysis failed",
      201
    );
  } catch (error) {
    next(error);
  }
};

const analyzeExistingNotice = async (
  req,
  res,
  next
) => {
  try {
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

    notice.analysisStatus =
      "processing";

    notice.analysisError = "";

    await notice.save();

    try {
      const analysis =
        await analyzeNotice({
          noticeText:
            notice.originalText,
          studentProfile
        });

      notice.title =
        analysis.title ||
        notice.title;

      notice.summary =
        analysis.summary || "";

      notice.importantPoints =
        analysis.importantPoints || [];

      notice.eligibility =
        analysis.eligibility;

      notice.deadlines =
        analysis.deadlines || [];

      notice.tasks =
        analysis.tasks || [];

      notice.roadmap =
        analysis.roadmap || [];

      notice.nextBestAction =
        analysis.nextBestAction || {};

      notice.warnings =
        analysis.warnings || [];

      notice.missingInformation =
        analysis.missingInformation || [];

      notice.confidence =
        analysis.confidence;

      notice.analysisStatus =
        "completed";

      await notice.save();

      await createAnalysisRecords({
        userId: req.user._id,
        notice,
        analysis
      });

      return successResponse(
        res,
        notice,
        "Notice analyzed successfully"
      );
    } catch (error) {
      notice.analysisStatus =
        "failed";

      notice.analysisError =
        error.message;

      await notice.save();

      return errorResponse(
        res,
        error.message,
        502
      );
    }
  } catch (error) {
    next(error);
  }
};

const getNotices = async (
  req,
  res,
  next
) => {
  try {
    const notices =
      await Notice.find({
        user: req.user._id
      }).sort({
        createdAt: -1
      });

    return successResponse(
      res,
      notices
    );
  } catch (error) {
    next(error);
  }
};

const getNotice = async (
  req,
  res,
  next
) => {
  try {
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

    return successResponse(
      res,
      notice
    );
  } catch (error) {
    next(error);
  }
};

const deleteNotice = async (
  req,
  res,
  next
) => {
  try {
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

    await Promise.all([
      Eligibility.deleteMany({
        notice: notice._id
      }),

      Deadline.deleteMany({
        notice: notice._id
      }),

      Task.deleteMany({
        notice: notice._id
      }),

      Roadmap.deleteMany({
        notice: notice._id
      })
    ]);

    if (notice.fileUrl) {
      const filename =
        path.basename(
          notice.fileUrl
        );

      const filePath =
        path.join(
          process.cwd(),
          "uploads",
          filename
        );

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await notice.deleteOne();

    return successResponse(
      res,
      null,
      "Notice deleted"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadNotice,
  analyzeExistingNotice,
  getNotices,
  getNotice,
  deleteNotice
};