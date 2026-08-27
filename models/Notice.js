const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    title: {
      type: String,
      default: "Untitled Notice"
    },

    originalText: {
      type: String,
      required: true
    },

    fileName: {
      type: String
    },

    fileUrl: {
      type: String
    },

    summary: {
      type: String,
      default: ""
    },

    importantPoints: [
      {
        type: String
      }
    ],

    eligibility: {
      status: {
        type: String,
        enum: [
          "eligible",
          "partially_eligible",
          "not_eligible",
          "unknown"
        ],
        default: "unknown"
      },

      reasons: [
        {
          type: String
        }
      ],

      requirements: {
        branches: [String],
        minimumCGPA: Number,
        maximumBacklogs: Number,
        requiredSkills: [String],
        year: mongoose.Schema.Types.Mixed,
        degree: String
      }
    },

    deadlines: [
      {
        title: String,
        type: String,
        date: Date,
        priority: {
          type: String,
          enum: ["low", "medium", "high", "urgent"],
          default: "medium"
        },
        sourceText: String
      }
    ],

    tasks: [
      {
        title: String,
        description: String,
        priority: {
          type: String,
          enum: ["low", "medium", "high", "urgent"],
          default: "medium"
        },
        status: {
          type: String,
          enum: ["pending", "in_progress", "completed"],
          default: "pending"
        },
        dependsOn: [
          {
            type: Number
          }
        ]
      }
    ],

    roadmap: [
      {
        step: Number,
        title: String,
        description: String,
        dependsOn: [Number]
      }
    ],

    nextBestAction: {
      title: String,
      reason: String,
      priority: String
    },

    warnings: [
      {
        type: String,
        message: String,
        sourceText: String
      }
    ],

    missingInformation: [
      {
        type: String
      }
    ],

    confidence: {
      type: Number,
      min: 0,
      max: 1
    },

    analysisStatus: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending"
    },

    analysisError: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Notice", noticeSchema);