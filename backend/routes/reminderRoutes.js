// routes/reminderRoutes.js
const express = require("express");
const router = express.Router();
const reminderController = require("../controllers/reminderController");

// Trigger reminders manually
router.get("/trigger", reminderController.triggerReminders);

// Health check
router.get("/health", reminderController.healthCheck);

// Get user reminders
router.get("/user/:email", reminderController.getUserReminders);

// Test email
router.post("/test-email", reminderController.testEmail);

// Get all upcoming reminders (admin)
router.get("/all", reminderController.getAllUpcomingReminders);

// Get specific meeting reminder status
router.get("/meeting/:meetingId", reminderController.getMeetingReminderStatus);

// Get reminders count for dashboard
router.get("/count/:email", reminderController.getRemindersCount);

// Clear old reminders
router.delete("/cleanup", reminderController.clearOldReminders);
// In routes/reminderRoutes.js
router.get('/debug-service', reminderController.debugReminderService);
router.post('/create-test-meeting', reminderController.createTestMeetingForReminders);

module.exports = router;