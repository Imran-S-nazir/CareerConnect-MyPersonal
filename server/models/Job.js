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
    category: {
      type: String,
      trim: true,
      default: "Web Development",
      index: true,
    },
    subCategory: {
      type: String,
      trim: true,
      default: "Full Stack Development",
    },
    department: {
      type: String,
      trim: true,
      default: "General",
    },
    employmentType: {
      type: String,
      enum: ["Full-time", "Part-time", "Contract", "Internship", "Freelance"],
      default: "Full-time",
      index: true,
    },
    workMode: {
      type: String,
      enum: ["On-site", "Hybrid", "Remote"],
      default: "Hybrid",
      index: true,
    },
    location: {
      type: String,
      required: [true, "Job location is required"],
      trim: true,
    },
    city: {
      type: String,
      trim: true,
      default: "Bangalore",
      index: true,
    },
    state: {
      type: String,
      trim: true,
      default: "Karnataka",
    },
    country: {
      type: String,
      trim: true,
      default: "India",
      index: true,
    },
    isInternational: {
      type: Boolean,
      default: false,
      index: true,
    },
    isPaid: {
      type: Boolean,
      default: true,
      index: true,
    },
    hasJobOffer: {
      type: Boolean,
      default: false,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
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
jobSchema.index({ category: 1, status: 1 });
jobSchema.index({ city: 1, status: 1 });
jobSchema.index({ workMode: 1, status: 1 });
jobSchema.index({ employmentType: 1, status: 1 });
jobSchema.index({ requiredSkills: 1 });

module.exports = mongoose.model("Job", jobSchema);
