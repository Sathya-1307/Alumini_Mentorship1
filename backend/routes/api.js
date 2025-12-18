const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// Auth routes
router.use("/auth", require("./authRoutes"));

// User fetch route
router.get("/users/get-by-email", userController.getUserByEmail);

// Mentor routes
router.use("/mentor", require("./mentorRoutes"));

// Mentee routes
router.use("/mentee", require("./menteeRoutes"));

// Mentor-Mentee assignment routes
router.use("/mentor-mentee", require("./mentorMenteeRoutes"));

// Program feedback routes
router.use("/program-feedback", require("./programFeedbackRoutes"));

// Meeting routes
router.use("/meetings", require("./meetingRoutes"));

// Meeting status routes
router.use("/meeting-status", require("./meetingStatusRoutes"));

// Phase management routes
router.use("/phases", require("./phaseRoutes"));
router.use("/dashboard", require("./dashboardRoutes"));

// REMINDER ROUTES - NEW
router.use("/reminders", require("./reminderRoutes"));

// Health check endpoint
router.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    services: {
      auth: "active",
      users: "active",
      meetings: "active",
      reminders: "active",
      feedback: "active",
      phases: "active"
    }
  });
});

// 404 handler for API routes
router.use((req, res) => {
  res.status(404).json({ 
    message: "API route not found",
    availableRoutes: [
      "/api/auth",
      "/api/users",
      "/api/mentor",
      "/api/mentee",
      "/api/mentor-mentee",
      "/api/program-feedback",
      "/api/meetings",
      "/api/meeting-status",
      "/api/phases",
      "/api/dashboard",
      "/api/reminders",
      "/api/health"
    ]
  });
});

module.exports = router;