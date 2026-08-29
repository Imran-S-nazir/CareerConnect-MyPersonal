const Application = require("../models/Application");
const Job = require("../models/Job");
const EmployerProfile = require("../models/EmployerProfile");
const StudentProfile = require("../models/StudentProfile");

const getEmployerProfileId = async (user) => {
  let profile = await EmployerProfile.findOne({ userId: user._id });
  if (!profile) {
    profile = await EmployerProfile.create({
      userId: user._id,
      companyName: user.fullName || "Company",
      officialEmail: user.email || "",
    });
  }
  return profile._id;
};

// GET /api/applications (Employer gets applications for their jobs)
exports.getEmployerApplications = async (req, res, next) => {
  try {
    const employerId = await getEmployerProfileId(req.user);
    const { jobId, status, search } = req.query;

    const query = { employerId };
    if (jobId && jobId !== "All") query.jobId = jobId;
    if (status && status !== "All") query.status = status;

    const applications = await Application.find(query)
      .populate("jobId", "title department location employmentType")
      .populate("candidateId", "fullName email phone profileImage userType")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/applications/apply (Candidate applies to a job)
exports.applyToJob = async (req, res, next) => {
  try {
    const { jobId, resumeUrl, coverLetter } = req.body;
    const candidateId = req.user._id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    const existing = await Application.findOne({ jobId, candidateId });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "You have already applied for this position",
      });
    }

    // Calculate match score
    const studentProf = await StudentProfile.findOne({ userId: candidateId }).lean();
    const candidateSkills = studentProf?.skills?.map((s) => (typeof s === "string" ? s : s.name)) || [];
    
    const strongSkills = candidateSkills.filter((s) =>
      (job.requiredSkills || []).some((reqS) => reqS.toLowerCase() === s.toLowerCase())
    );
    const missingSkills = (job.requiredSkills || []).filter(
      (reqS) => !candidateSkills.some((s) => s.toLowerCase() === reqS.toLowerCase())
    );

    const matchOverall = Math.min(100, Math.max(40, Math.round(50 + (strongSkills.length * 15))));

    const application = await Application.create({
      jobId,
      candidateId,
      employerId: job.employerId,
      resumeUrl: resumeUrl || "",
      coverLetter: coverLetter || "",
      status: "Applied",
      stageHistory: [
        {
          stage: "Applied",
          notes: "Application submitted by candidate",
          changedBy: candidateId,
          changedAt: new Date(),
        },
      ],
      matchScore: {
        overall: matchOverall,
        skills: Math.min(100, strongSkills.length * 25),
        experience: 75,
        education: 90,
      },
      matchingDetails: {
        strongSkills,
        missingSkills,
      },
    });

    // Update job applicant count
    job.applicantsCount += 1;
    await job.save();

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/applications/:id/stage (Employer updates applicant status)
exports.updateApplicationStage = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const employerId = await getEmployerProfileId(req.user);

    const application = await Application.findOne({ _id: req.params.id, employerId });
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    application.status = status;
    application.stageHistory.push({
      stage: status,
      notes: notes || `Moved to ${status}`,
      changedBy: req.user._id,
      changedAt: new Date(),
    });

    await application.save();

    return res.status(200).json({
      success: true,
      message: `Applicant moved to ${status}`,
      application,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/applications/:id/note (Add recruiter internal note)
exports.addApplicationNote = async (req, res, next) => {
  try {
    const { note } = req.body;
    const employerId = await getEmployerProfileId(req.user);

    const application = await Application.findOne({ _id: req.params.id, employerId });
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    application.internalNotes.push({
      author: req.user.fullName || "Recruiter",
      note,
      createdAt: new Date(),
    });

    await application.save();

    return res.status(200).json({
      success: true,
      message: "Note added",
      application,
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/applications/:id/rating (Recruiter rating 1-5)
exports.rateApplication = async (req, res, next) => {
  try {
    const { rating } = req.body;
    const employerId = await getEmployerProfileId(req.user);

    const application = await Application.findOneAndUpdate(
      { _id: req.params.id, employerId },
      { recruiterRating: rating },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Rating updated",
      application,
    });
  } catch (error) {
    next(error);
  }
};
