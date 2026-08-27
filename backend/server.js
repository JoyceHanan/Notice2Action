require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit =
  require("express-rate-limit");
const morgan = require("morgan");
const path = require("path");

const connectDB =
  require("./config/db");

const errorHandler =
  require("./middlewares/errorMiddleware");

const {
  startReminderWorker
} = require(
  "./services/notification/reminderService"
);

const authRoutes =
  require("./routes/authRoutes");

const profileRoutes =
  require("./routes/profileRoutes");

const noticeRoutes =
  require("./routes/noticeRoutes");

const eligibilityRoutes =
  require("./routes/eligibilityRoutes");

const deadlineRoutes =
  require("./routes/deadlineRoutes");

const checklistRoutes =
  require("./routes/checklistRoutes");

const roadmapRoutes =
  require("./routes/roadmapRoutes");

const chatRoutes =
  require("./routes/chatRoutes");

const reminderRoutes =
  require("./routes/reminderRoutes");

const dashboardRoutes =
  require("./routes/dashboardRoutes");

const app =
  express();

connectDB();

app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);

app.use(
  cors({
    origin:
      process.env.CLIENT_URL ||
      "http://localhost:5173",
    credentials: true
  })
);

app.use(
  express.json({
    limit: "2mb"
  })
);

app.use(
  express.urlencoded({
    extended: true
  })
);

app.use(morgan("dev"));

const limiter =
  rateLimit({
    windowMs:
      15 * 60 * 1000,
    max: 200,
    message: {
      success: false,
      message:
        "Too many requests. Please try again later."
    }
  });

app.use("/api", limiter);

app.use(
  "/uploads",
  express.static(
    path.join(
      process.cwd(),
      "uploads"
    )
  )
);

app.get(
  "/",
  (req, res) => {
    res.json({
      success: true,
      message:
        "Notice2Action API is running"
    });
  }
);

app.get(
  "/api/health",
  (req, res) => {
    res.json({
      success: true,
      message: "Server healthy",
      timestamp:
        new Date().toISOString()
    });
  }
);

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/profile",
  profileRoutes
);

app.use(
  "/api/notices",
  noticeRoutes
);

app.use(
  "/api/eligibility",
  eligibilityRoutes
);

app.use(
  "/api/deadlines",
  deadlineRoutes
);

app.use(
  "/api/checklist",
  checklistRoutes
);

app.use(
  "/api/tasks",
  checklistRoutes
);

app.use(
  "/api/roadmap",
  roadmapRoutes
);

app.use(
  "/api/chat",
  chatRoutes
);

app.use(
  "/api/reminders",
  reminderRoutes
);

app.use(
  "/api/dashboard",
  dashboardRoutes
);

app.use(
  (req, res) => {
    res.status(404).json({
      success: false,
      message:
        `Route not found: ${req.method} ${req.originalUrl}`
    });
  }
);

app.use(errorHandler);

const PORT =
  process.env.PORT || 5000;

app.listen(
  PORT,
  () => {
    console.log(
      `Notice2Action server running on port ${PORT}`
    );

    startReminderWorker();
  }
);