const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/homedashboardController");

// GET dashboard overview with statistics
router.get("/overview", dashboardController.getDashboardOverview);

// GET detailed information about a specific phase
router.get("/phase/:phaseId", dashboardController.getPhaseDetails);

module.exports = router;