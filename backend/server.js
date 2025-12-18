// server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

// Connect to MongoDB with retry logic
const connectWithRetry = async () => {
  try {
    await connectDB();
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('🔄 Retrying in 5 seconds...');
    setTimeout(connectWithRetry, 5000);
  }
};

connectWithRetry();

const app = express();
app.use(express.json());
app.use(cors());

// Import reminder services
const { setupReminderScheduler } = require('./services/reminderService');
const { testEmailConfig } = require('./services/emailService');

// Setup reminder scheduler after DB connection is established
setTimeout(() => {
  if (process.env.NODE_ENV !== 'test') {
    setupReminderScheduler();
    console.log('✅ Reminder scheduler initialized');
  }

  // Test email configuration
  testEmailConfig().then(success => {
    if (success) {
      console.log('✅ Email service configured successfully');
    } else {
      console.log('⚠️ Email service not configured. Reminders will not work.');
    }
  });
}, 3000); // Wait 3 seconds for DB connection

// API Routes
app.use("/api", require("./routes/api"));

// Health check endpoint
app.get("/health", async (req, res) => {
  const mongoose = require('mongoose');
  
  // Test email service
  const emailStatus = await testEmailConfig().catch(() => false);
  
  res.json({
    status: mongoose.connection.readyState === 1 ? "healthy" : "unhealthy",
    timestamp: new Date().toISOString(),
    services: {
      mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
      api: "active",
      reminders: process.env.NODE_ENV !== 'test' ? "active" : "disabled",
      email: emailStatus ? "configured" : "not configured"
    },
    environment: process.env.NODE_ENV || "development",
    port: process.env.PORT || 5000
  });
});

// Basic route for testing
app.get("/", (req, res) => {
  res.json({
    message: "Mentorship Program API",
    version: "1.0.0",
    endpoints: {
      api: "/api",
      health: "/health"
    },
    services: {
      reminders: "Automated email reminders (1 week & 3 days before meetings)",
      email_notifications: process.env.EMAIL_USER ? "Enabled" : "Disabled"
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    message: "Route not found. Available routes:",
    endpoints: {
      api: "/api",
      health: "/health",
      root: "/"
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📧 Email reminders: ${process.env.EMAIL_USER ? 'Enabled' : 'Disabled'}`);
  console.log(`⏰ Auto-reminders: ${process.env.NODE_ENV !== 'test' ? 'Enabled' : 'Disabled'}`);
  console.log(`🔗 API available at: http://localhost:${PORT}/api`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`📊 Database: ${process.env.MENTORSHIP_DB_URI ? 'Configured' : 'Not configured'}`);
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("👋 Shutting down server...");
  const mongoose = require('mongoose');
  await mongoose.connection.close();
  console.log("✅ MongoDB connection closed");
  process.exit(0);
});