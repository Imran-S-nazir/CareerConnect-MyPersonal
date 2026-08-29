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

// GET /api/applications/my (Candidate gets all their submitted applications with live statuses)
exports.getMyApplications = async (req, res, next) => {
  try {
    const candidateId = req.user._id;
    const applications = await Application.find({ candidateId })
      .populate({
        path: "jobId",
        select: "title department location employmentType workMode salaryRange deadline status",
        populate: { path: "employerId", select: "companyName logo" },
      })
      .populate("employerId", "companyName logo")
      .sort({ createdAt: -1 });

    const stats = {
      applied: applications.filter((a) => a.status === "Applied").length,
      underReview: applications.filter((a) => ["Screening", "Under Review"].includes(a.status)).length,
      shortlisted: applications.filter((a) => a.status === "Shortlisted").length,
      interview: applications.filter((a) => ["Interview", "Final Interview"].includes(a.status)).length,
      selected: applications.filter((a) => ["Offer", "Hired"].includes(a.status)).length,
      rejected: applications.filter((a) => a.status === "Rejected").length,
    };

    return res.status(200).json({
      success: true,
      count: applications.length,
      stats,
      applications,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/applications/employer (Employer gets applications for their jobs)
exports.getEmployerApplications = async (req, res, next) => {
  try {
    const employerId = await getEmployerProfileId(req.user);
    const { jobId, status, search } = req.query;

    const query = { employerId };
    if (jobId && jobId !== "All") query.jobId = jobId;
    if (status && status !== "All") query.status = status;

    const applications = await Application.find(query)
      .populate("jobId", "title department location employmentType workMode")
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
    const { jobId, opportunityId, resumeUrl, coverLetter } = req.body;
    const targetJobId = jobId || opportunityId;
    const candidateId = req.user._id;

    if (!targetJobId) {
      return res.status(400).json({ success: false, message: "Job ID is required" });
    }

    const job = await Job.findById(targetJobId).populate("employerId");
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (job.status !== "Published") {
      return res.status(400).json({ success: false, message: "This position is no longer accepting applications" });
    }

    if (job.deadline && new Date(job.deadline) < new Date()) {
      return res.status(400).json({ success: false, message: "Application deadline has passed" });
    }

    const existing = await Application.findOne({ jobId: targetJobId, candidateId });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Application already submitted for this opportunity",
      });
    }

    // Calculate match score
    const studentProf = await StudentProfile.findOne({ userId: candidateId }).lean();
    const candidateSkills = studentProf?.technicalSkills || studentProf?.skills?.map((s) => (typeof s === "string" ? s : s.name)) || [];
    
    const strongSkills = candidateSkills.filter((s) =>
      (job.requiredSkills || []).some((reqS) => reqS.toLowerCase() === s.toLowerCase())
    );
    const missingSkills = (job.requiredSkills || []).filter(
      (reqS) => !candidateSkills.some((s) => s.toLowerCase() === reqS.toLowerCase())
    );

    const matchOverall = Math.min(100, Math.max(40, Math.round(50 + (strongSkills.length * 15))));

    const application = await Application.create({
      jobId: targetJobId,
      candidateId,
      employerId: job.employerId?._id || job.employerId,
      resumeUrl: resumeUrl || studentProf?.resume?.resumeUrl || "",
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

    const companyName = job.employerId?.companyName || "Employer";

    return res.status(201).json({
      success: true,
      message: `Application submitted successfully for "${job.title}" at ${companyName}!`,
      application: {
        _id: application._id,
        id: application._id,
        jobId: job._id,
        title: job.title,
        company: companyName,
        type: job.employmentType,
        appliedDate: "Today",
        status: "Applied",
        createdAt: application.createdAt,
      },
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

// POST /api/applications/:id/notes (Add recruiter internal note)
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
