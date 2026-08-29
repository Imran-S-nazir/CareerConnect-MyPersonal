const express = require("express");
const router = express.Router();
const internshipController = require("../controllers/internshipController");

// Category metadata & aggregated counts
router.get("/categories", internshipController.getInternshipCategories);

// Category shortcut routes
router.get("/work-from-home", (req, res, next) => {
  req.query.workMode = "Remote";
  return internshipController.getInternships(req, res, next);
});

router.get("/international", (req, res, next) => {
  req.query.isInternational = "true";
  return internshipController.getInternships(req, res, next);
});

router.get("/latest", (req, res, next) => {
  req.query.sort = "latest";
  return internshipController.getInternships(req, res, next);
});

router.get("/paid", (req, res, next) => {
  req.query.isPaid = "true";
  return internshipController.getInternships(req, res, next);
});

router.get("/with-job-offer", (req, res, next) => {
  req.query.hasJobOffer = "true";
  return internshipController.getInternships(req, res, next);
});

router.get("/in/:city", (req, res, next) => {
  req.query.city = req.params.city;
  return internshipController.getInternships(req, res, next);
});

router.get("/category/:category", (req, res, next) => {
  req.query.category = req.params.category;
  return internshipController.getInternships(req, res, next);
});

// General filterable catalog
router.get("/", internshipController.getInternships);
router.get("/:id", internshipController.getInternshipById);

module.exports = router;
