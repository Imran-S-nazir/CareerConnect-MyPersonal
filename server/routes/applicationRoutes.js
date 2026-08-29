const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/applicationController");
const protect = require("../middleware/authMiddleware");
const { requireEmployer } = require("../middleware/roleMiddleware");

// Candidate applications
router.get("/my", protect, applicationController.getMyApplications);
router.post("/apply", protect, applicationController.applyToJob);

// Employer ATS actions
router.get("/employer", protect, requireEmployer, applicationController.getEmployerApplications);
router.patch("/:id/stage", protect, requireEmployer, applicationController.updateApplicationStage);
router.post("/:id/notes", protect, requireEmployer, applicationController.addApplicationNote);
router.patch("/:id/rating", protect, requireEmployer, applicationController.rateApplication);

module.exports = router;
