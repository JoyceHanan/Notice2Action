const mongoose = require("mongoose");

const roadmapSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    notice: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Notice",
      required: true
    },

    steps: [
      {
        step: Number,
        title: String,
        description: String,
        dependsOn: [Number]
      }
    ]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Roadmap", roadmapSchema);