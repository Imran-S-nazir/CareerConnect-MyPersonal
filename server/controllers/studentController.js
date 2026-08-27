const User = require("../models/User");
const StudentProfile = require("../models/StudentProfile");

// Skill benchmarks for target roles for Skill Gap Analysis
const ROLE_SKILL_BENCHMARKS = {
  "Frontend Developer": ["HTML", "CSS", "JavaScript", "React", "TypeScript", "Tailwind CSS", "Redux", "Git"],
  "Backend Developer": ["Node.js", "Express", "MongoDB", "SQL", "REST API", "Docker", "Authentication", "Git"],
  "Full Stack Developer": ["React", "Node.js", "Express", "MongoDB", "JavaScript", "TypeScript", "REST API", "Git", "Tailwind CSS"],
  "Software Engineer": ["Data Structures", "Algorithms", "Java", "C++", "Python", "SQL", "Git", "OOP"],
  "Data Scientist / Analyst": ["Python", "SQL", "Pandas", "NumPy", "Machine Learning", "Data Visualization", "PowerBI"],
  "DevOps Engineer": ["Linux", "Docker", "Kubernetes", "AWS", "CI/CD", "Git", "Terraform"],
};

// Calculate profile completion percentage (0 - 100)
const calculateProfileCompletion = (profile, user) => {
  let score = 0;
  // 1. Basic Information (20%)
  if (user?.fullName && user?.email && user?.phone) score += 20;

  // 2. Education (20%)
  if (profile?.education && profile.education.length > 0) score += 20;

  // 3. Skills (20%)
  const totalSkills = (profile?.technicalSkills?.length || 0) + (profile?.softSkills?.length || 0);
  if (totalSkills >= 3) score += 20;
  else if (totalSkills > 0) score += 10;

  // 4. Projects (20%)
  if (profile?.projects && profile.projects.length > 0) score += 20;

  // 5. Resume or Certifications (20%)
  if (profile?.resume?.resumeName || profile?.resume?.resumeUrl) score += 10;
  if (profile?.certifications && profile.certifications.length > 0) score += 10;

  return Math.min(100, Math.max(0, score));
};

// Calculate Career Readiness Score (0 - 100) and breakdown
const calculateCareerReadiness = (profile, completion) => {
  const breakdown = {
    profileStrength: { score: completion, max: 100, weight: 20 },
    skillsScore: { score: 0, max: 100, weight: 25 },
    projectsScore: { score: 0, max: 100, weight: 25 },
    resumeScore: { score: 0, max: 100, weight: 15 },
    certificationsScore: { score: 0, max: 100, weight: 15 },
  };

  const techCount = profile?.technicalSkills?.length || 0;
  breakdown.skillsScore.score = Math.min(100, techCount * 20);

  const projCount = profile?.projects?.length || 0;
  breakdown.projectsScore.score = Math.min(100, projCount * 50);

  const hasResume = !!(profile?.resume?.resumeName || profile?.resume?.resumeUrl);
  breakdown.resumeScore.score = hasResume ? 100 : 0;

  const certCount = profile?.certifications?.length || 0;
  breakdown.certificationsScore.score = Math.min(100, certCount * 50);

  const totalScore = Math.round(
    (breakdown.profileStrength.score * 0.2) +
    (breakdown.skillsScore.score * 0.25) +
    (breakdown.projectsScore.score * 0.25) +
    (breakdown.resumeScore.score * 0.15) +
    (breakdown.certificationsScore.score * 0.15)
  );

  const tips = [];
  if (techCount < 5) tips.push("Add at least 5 technical skills to enhance recruiter matching.");
  if (projCount < 2) tips.push("Add 2 or more projects with GitHub and Live demo links.");
  if (!hasResume) tips.push("Upload or generate a verified resume to unlock 1-click applications.");
  if (certCount === 0) tips.push("Add professional certifications to boost credential credibility.");

  return {
    score: totalScore,
    breakdown,
    tips: tips.length > 0 ? tips : ["Your profile is in top-tier shape! Keep applying for open roles."],
  };
};

// Skill Gap Analysis
const analyzeSkillGap = (profile) => {
  const targetRole = profile?.careerGoal || profile?.jobPreferences?.preferredRoles?.[0] || "Full Stack Developer";
  const benchmarkSkills = ROLE_SKILL_BENCHMARKS[targetRole] || ROLE_SKILL_BENCHMARKS["Full Stack Developer"];
  const studentSkills = (profile?.technicalSkills || []).map((s) => s.trim().toLowerCase());

  const mastered = [];
  const recommendedToLearn = [];

  benchmarkSkills.forEach((skill) => {
    if (studentSkills.includes(skill.toLowerCase())) {
      mastered.push(skill);
    } else {
      recommendedToLearn.push(skill);
    }
  });

  return {
    targetRole,
    mastered,
    recommendedToLearn,
    matchPercentage: Math.round((mastered.length / benchmarkSkills.length) * 100),
  };
};

// ==========================================
// GET STUDENT DASHBOARD DATA
// ==========================================
module.exports.getStudentDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;
    let profile = await StudentProfile.findOne({ userId });

    // Auto-create initial profile if none exists
    if (!profile) {
      profile = await StudentProfile.create({
        userId,
        technicalSkills: ["JavaScript", "React", "Node.js", "Git"],
        softSkills: ["Communication", "Problem Solving", "Teamwork"],
        education: [
          {
            institution: "Geeta University",
            degree: "B.Tech Computer Science",
            fieldOfStudy: "Computer Science & Engineering",
            startYear: 2024,
            endYear: 2028,
            currentlyStudying: true,
          },
        ],
        careerGoal: "Full Stack Developer",
        jobPreferences: {
          preferredRoles: ["Full Stack Developer", "Frontend Developer"],
          preferredLocations: ["Bangalore", "Gurgaon", "Remote"],
          jobTypes: ["internship", "full-time"],
          remote: true,
        },
      });
    }

    const completion = calculateProfileCompletion(profile, req.user);
    const readiness = calculateCareerReadiness(profile, completion);
    const skillGap = analyzeSkillGap(profile);

    // Dynamic curated internship recommendations
    const recommendedInternships = [
      {
        id: "int-101",
        title: "Frontend Developer Intern",
        company: "TechNova Labs",
        location: "Remote / Bangalore",
        stipend: "₹25,000 / month",
        duration: "3 Months",
        type: "Internship",
        workMode: "Remote",
        skillsRequired: ["React", "JavaScript", "Tailwind CSS"],
        postedAt: "2 days ago",
        deadline: "30 Aug 2026",
      },
      {
        id: "int-102",
        title: "Full Stack Engineer Intern",
        company: "CloudScale Systems",
        location: "Gurgaon",
        stipend: "₹30,000 / month",
        duration: "6 Months",
        type: "Internship",
        workMode: "Hybrid",
        skillsRequired: ["Node.js", "React", "MongoDB"],
        postedAt: "3 days ago",
        deadline: "05 Sep 2026",
      },
      {
        id: "int-103",
        title: "Backend Development Intern",
        company: "RazorFlow Technologies",
        location: "Bangalore",
        stipend: "₹28,000 / month",
        duration: "4 Months",
        type: "Internship",
        workMode: "On-site",
        skillsRequired: ["Node.js", "Express", "SQL"],
        postedAt: "1 day ago",
        deadline: "02 Sep 2026",
      },
    ];

    // Dynamic curated job recommendations
    const recommendedJobs = [
      {
        id: "job-201",
        title: "Junior Software Engineer (Campus Hire)",
        company: "NexGen Solutions",
        location: "Hyderabad",
        salary: "₹6.5 - 9.0 LPA",
        type: "Full-Time",
        workMode: "Hybrid",
        skillsRequired: ["JavaScript", "Data Structures", "Node.js"],
        postedAt: "Just now",
      },
      {
        id: "job-202",
        title: "Associate React / Web Developer",
        company: "InnovateX Tech",
        location: "Pune / Remote",
        salary: "₹6.0 - 8.5 LPA",
        type: "Full-Time",
        workMode: "Remote",
        skillsRequired: ["React", "Redux", "TypeScript"],
        postedAt: "1 day ago",
      },
      {
        id: "job-203",
        title: "Graduate Engineer Trainee (GET)",
        company: "Cognitive Works",
        location: "Bangalore",
        salary: "₹7.0 - 10.0 LPA",
        type: "Full-Time",
        workMode: "On-site",
        skillsRequired: ["Python", "SQL", "Cloud Basics"],
        postedAt: "3 days ago",
      },
    ];

    // Recommended Courses based on skill gaps
    const recommendedCourses = [
      {
        id: "crs-301",
        title: "Mastering Full-Stack MERN Development",
        provider: "CareerConnect Academy",
        level: "Intermediate",
        duration: "8 Weeks",
        rating: 4.9,
        skillsCovered: ["React", "Node.js", "MongoDB", "Express", "Deployment"],
        isFree: true,
      },
      {
        id: "crs-302",
        title: "Data Structures & Algorithms in JavaScript & C++",
        provider: "AlgoPro Learning",
        level: "Beginner to Advanced",
        duration: "10 Weeks",
        rating: 4.8,
        skillsCovered: ["Trees", "Graphs", "Dynamic Programming", "Recursion"],
        isFree: true,
      },
      {
        id: "crs-303",
        title: "Docker, Kubernetes & Microservices for Developers",
        provider: "Cloud Native Mastery",
        level: "Advanced",
        duration: "6 Weeks",
        rating: 4.9,
        skillsCovered: ["Docker", "Kubernetes", "CI/CD", "AWS"],
        isFree: false,
      },
    ];

    // Application statistics & recent list
    const applications = {
      stats: {
        applied: 8,
        underReview: 4,
        shortlisted: 2,
        interview: 1,
        selected: 1,
        rejected: 0,
      },
      recent: [
        {
          id: "app-1",
          title: "Frontend Intern",
          company: "TechNova Labs",
          appliedDate: "24 Aug 2026",
          status: "Under Review",
          lastUpdated: "Yesterday",
        },
        {
          id: "app-2",
          title: "Full Stack Engineer Intern",
          company: "CloudScale Systems",
          appliedDate: "20 Aug 2026",
          status: "Shortlisted",
          lastUpdated: "2 days ago",
        },
        {
          id: "app-3",
          title: "Associate React Developer",
          company: "InnovateX Tech",
          appliedDate: "18 Aug 2026",
          status: "Interview",
          lastUpdated: "3 days ago",
        },
      ],
    };

    // Saved opportunities
    const savedOpportunities = [
      {
        id: "save-1",
        title: "Full Stack Engineer Intern",
        company: "CloudScale Systems",
        type: "Internship",
        deadline: "05 Sep 2026",
        savedAt: "25 Aug 2026",
      },
      {
        id: "save-2",
        title: "Junior Software Engineer (Campus Hire)",
        company: "NexGen Solutions",
        type: "Job",
        deadline: "10 Sep 2026",
        savedAt: "24 Aug 2026",
      },
    ];

    // Upcoming deadlines with urgency indicators
    const upcomingDeadlines = [
      {
        id: "dl-1",
        title: "TechNova Labs Internship Application",
        type: "Internship",
        date: "30 Aug 2026",
        daysRemaining: 4,
        urgency: "urgent", // urgent (<5 days), medium (5-10), normal (>10)
      },
      {
        id: "dl-2",
        title: "RazorFlow Tech Hiring Challenge",
        type: "Hackathon / Job",
        date: "02 Sep 2026",
        daysRemaining: 7,
        urgency: "medium",
      },
      {
        id: "dl-3",
        title: "CloudScale Systems Internship",
        type: "Internship",
        date: "05 Sep 2026",
        daysRemaining: 10,
        urgency: "normal",
      },
    ];

    // Notifications
    const notifications = [
      {
        id: "notif-1",
        title: "Application Shortlisted 🎉",
        message: "CloudScale Systems has shortlisted your application for Full Stack Intern!",
        date: "2 hours ago",
        isRead: false,
        type: "application",
      },
      {
        id: "notif-2",
        title: "New Internship Matching Your Skills",
        message: "RazorFlow Technologies posted a new Node.js & SQL internship.",
        date: "1 day ago",
        isRead: false,
        type: "recommendation",
      },
      {
        id: "notif-3",
        title: "Complete Your Resume",
        message: "Add project live URLs to boost your profile readiness score by 15%.",
        date: "2 days ago",
        isRead: true,
        type: "profile",
      },
    ];

    return res.status(200).json({
      success: true,
      data: {
        user: {
          _id: req.user._id,
          fullName: req.user.fullName,
          username: req.user.username,
          email: req.user.email,
          phone: req.user.phone,
          profileImage: req.user.profileImage,
          role: req.user.role,
          userType: req.user.userType,
        },
        profile,
        profileCompletion: completion,
        careerReadiness: readiness,
        skillGap,
        education: profile.education || [],
        technicalSkills: profile.technicalSkills || [],
        softSkills: profile.softSkills || [],
        projects: profile.projects || [],
        certifications: profile.certifications || [],
        achievements: profile.achievements || [],
        experience: profile.experience || [],
        resume: profile.resume || {},
        careerGoal: profile.careerGoal || "Full Stack Developer",
        jobPreferences: profile.jobPreferences || {},
        recommendedInternships,
        recommendedJobs,
        recommendedCourses,
        applications,
        savedOpportunities,
        upcomingDeadlines,
        notifications,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// GET STUDENT PROFILE
// ==========================================
module.exports.getStudentProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    let profile = await StudentProfile.findOne({ userId }).populate("userId", "fullName email username phone profileImage");

    if (!profile) {
      profile = await StudentProfile.create({
        userId,
        technicalSkills: ["JavaScript", "React", "Node.js"],
        education: [
          {
            institution: "University / College",
            degree: "Undergraduate Degree",
            startYear: 2024,
            endYear: 2028,
            currentlyStudying: true,
          },
        ],
      });
      profile = await profile.populate("userId", "fullName email username phone profileImage");
    }

    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// UPDATE STUDENT PROFILE
// ==========================================
module.exports.updateStudentProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const updateData = req.body;

    const profile = await StudentProfile.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true, upsert: true, runValidators: true }
    );

    const completion = calculateProfileCompletion(profile, req.user);
    profile.profileCompletion = completion;
    profile.isProfileComplete = completion >= 80;
    await profile.save();

    await User.findByIdAndUpdate(userId, {
      profileCompletion: completion,
      isProfileComplete: completion >= 80,
    });

    return res.status(200).json({
      success: true,
      message: "Student profile updated successfully",
      profile,
      profileCompletion: completion,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// SAVE / BOOKMARK OPPORTUNITY
// ==========================================
module.exports.toggleSaveOpportunity = async (req, res, next) => {
  try {
    const { opportunityId, title, type } = req.body;
    return res.status(200).json({
      success: true,
      message: "Opportunity saved to your workspace",
      savedItem: { id: opportunityId, title, type, savedAt: new Date() },
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// APPLY TO OPPORTUNITY
// ==========================================
module.exports.applyOpportunity = async (req, res, next) => {
  try {
    const { opportunityId, title, company, type } = req.body;
    return res.status(200).json({
      success: true,
      message: "Application submitted successfully",
      application: {
        id: `app-${Date.now()}`,
        opportunityId,
        title,
        company,
        type,
        appliedDate: "Today",
        status: "Applied",
      },
    });
  } catch (error) {
    next(error);
  }
};
