const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmployerProfile",
      required: true,
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      maxlength: 150,
    },
    department: {
      type: String,
      trim: true,
      default: "General",
    },
    employmentType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship"],
      default: "Full-time",
    },
    workMode: {
      type: String,
      enum: ["On-site", "Hybrid", "Remote"],
      default: "Hybrid",
    },
    location: {
      type: String,
      required: [true, "Job location is required"],
      trim: true,
    },
    salaryRange: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
      currency: { type: String, default: "INR" },
      isNegotiable: { type: Boolean, default: false },
    },
    experience: {
      minYears: { type: Number, default: 0 },
      maxYears: { type: Number, default: 2 },
      level: {
        type: String,
        enum: ["Fresher / Entry-Level", "Junior (1-3 yrs)", "Mid-Level (3-5 yrs)", "Senior (5+ yrs)"],
        default: "Fresher / Entry-Level",
      },
    },
    education: {
      type: String,
      default: "Any Graduate / B.Tech / BCA / MCA",
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
      trim: true,
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    requiredSkills: {
      type: [String],
      default: [],
      index: true,
    },
    preferredSkills: {
      type: [String],
      default: [],
    },
    bonusSkills: {
      type: [String],
      default: [],
    },
    openings: {
      type: Number,
      default: 1,
      min: 1,
    },
    deadline: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["Draft", "Pending Approval", "Published", "Paused", "Closed"],
      default: "Published",
      index: true,
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    applicantsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

jobSchema.index({ employerId: 1, status: 1 });
jobSchema.index({ requiredSkills: 1 });

module.exports = mongoose.model("Job", jobSchema);
