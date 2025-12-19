// routes/homeDashboardRoutes.js
const express = require('express');
const router = express.Router();
const homeDashboardController = require('../controllers/homeDashboardController');

// ==================== HOME DASHBOARD ROUTES ====================

// GET home dashboard overview with optional phase filter
// GET /api/home-dashboard/overview?phaseId=1
router.get('/overview', homeDashboardController.getHomeDashboardOverview);

// GET specific phase details for home dashboard
// GET /api/home-dashboard/phase/:phaseId
router.get('/phase/:phaseId', homeDashboardController.getHomePhaseDetails);

// GET quick statistics for home dashboard
// GET /api/home-dashboard/quick-stats
router.get('/quick-stats', homeDashboardController.getHomeQuickStats);

module.exports = router;