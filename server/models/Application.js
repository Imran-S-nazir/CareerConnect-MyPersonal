const mongoose = require("mongoose");

const stageHistorySchema = new mongoose.Schema(
  {
    stage: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
      default: "",
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EmployerProfile",
      required: true,
      index: true,
    },
    resumeUrl: {
      type: String,
      default: "",
    },
    coverLetter: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: [
        "Applied",
        "Screening",
        "Shortlisted",
        "Assessment",
        "Interview",
        "Final Interview",
        "Offer",
        "Hired",
        "Rejected",
      ],
      default: "Applied",
      index: true,
    },
    stageHistory: [stageHistorySchema],
    matchScore: {
      overall: { type: Number, default: 0 },
      skills: { type: Number, default: 0 },
      experience: { type: Number, default: 0 },
      education: { type: Number, default: 0 },
      assessment: { type: Number, default: 0 },
    },
    matchingDetails: {
      strongSkills: { type: [String], default: [] },
      missingSkills: { type: [String], default: [] },
    },
    recruiterRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    internalNotes: [
      {
        author: String,
        note: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

applicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });
applicationSchema.index({ employerId: 1, status: 1 });

module.exports = mongoose.model("Application", applicationSchema);
