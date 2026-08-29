const User = require("../models/User");
const FresherProfile = require("../models/FresherProfile");

// Skill benchmarks for target roles for Job Matching & Skill Gap Analysis
const ROLE_SKILL_BENCHMARKS = {
  "Full Stack Developer": [
    "JavaScript", "React", "Node.js", "Express", "MongoDB", "REST API", "Git", "HTML", "CSS", "TypeScript"
  ],
  "Frontend Developer": [
    "JavaScript", "React", "HTML", "CSS", "Tailwind CSS", "TypeScript", "Redux", "Git"
  ],
  "Backend Developer": [
    "Node.js", "Express", "MongoDB", "SQL", "REST API", "Python", "Docker", "Authentication", "Git"
  ],
  "Software Developer": [
    "Data Structures", "Algorithms", "Java", "C++", "Python", "SQL", "Git", "OOP"
  ],
  "Junior Software Engineer": [
    "JavaScript", "Python", "Java", "Data Structures", "SQL", "Git", "Problem Solving"
  ],
  "Data Analyst": [
    "Python", "SQL", "Excel", "Pandas", "NumPy", "Data Visualization", "PowerBI", "Tableau"
  ],
  "QA Engineer": [
    "JavaScript", "Selenium", "Manual Testing", "Automation Testing", "Postman", "Jest", "Git"
  ],
  "DevOps Engineer": [
    "Linux", "Docker", "Kubernetes", "AWS", "CI/CD", "Git", "Shell Scripting"
  ],
};

// ==========================================
// DYNAMIC PROFILE COMPLETION (Weighted logic)
// Allows reaching 100% even without internship
// ==========================================
const calculateFresherProfileCompletion = (profile, user) => {
  let score = 0;

  // 1. Basic Info (10%)
  const hasBasicInfo = !!(
    (user?.fullName || profile?.userId?.fullName) &&
    (user?.email || profile?.userId?.email) &&
    (user?.phone || profile?.userId?.phone || profile?.location?.city)
  );
  if (hasBasicInfo) score += 10;

  // 2. Professional Headline & Objective (10%)
  if (profile?.professionalHeadline && profile.professionalHeadline.trim().length >= 5) score += 5;
  if (profile?.careerObjective && profile.careerObjective.trim().length >= 10) score += 5;

  // 3. Educational Qualification (15%)
  if (profile?.education && profile.education.length > 0) {
    const highest = profile.education.find((e) => e.degree && e.institution);
    if (highest) score += 15;
    else score += 10;
  }

  // 4. Skills (15%)
  const totalSkills =
    (profile?.skills?.programmingLanguages?.length || 0) +
    (profile?.skills?.frameworks?.length || 0) +
    (profile?.skills?.databases?.length || 0) +
    (profile?.skills?.tools?.length || 0) +
    (profile?.skills?.softSkills?.length || 0) +
    (profile?.skills?.technical?.length || 0);

  if (totalSkills >= 4) score += 15;
  else if (totalSkills >= 2) score += 10;
  else if (totalSkills > 0) score += 5;

  // 5. Projects (15%)
  if (profile?.projects && profile.projects.length >= 2) score += 15;
  else if (profile?.projects && profile.projects.length === 1) score += 10;

  // 6. Job Preferences & Availability (10%)
  const hasPreferences =
    (profile?.jobPreferences?.preferredRoles?.length > 0 || profile?.targetRole) &&
    (profile?.jobPreferences?.preferredLocations?.length > 0 || profile?.jobPreferences?.workMode?.length > 0);
  if (hasPreferences) score += 10;

  // 7. Resume (10%)
  const hasResume = !!(profile?.resume?.resumeUrl || profile?.resume?.resumeName || profile?.resume?.isGenerated);
  if (hasResume) score += 10;

  // 8. Experience / Internship OR Certifications / Achievements (15% flexible distribution)
  const hasInternship = profile?.internships && profile.internships.length > 0;
  const hasCertifications = profile?.certifications && profile.certifications.length > 0;
  const hasAchievements = profile?.achievements && profile.achievements.length > 0;
  const hasCodingProfiles = profile?.codingProfiles && profile.codingProfiles.length > 0;

  if (hasInternship && (hasCertifications || hasAchievements)) {
    score += 15;
  } else if (hasInternship || hasCertifications || hasAchievements) {
    score += 10;
  }

  if (hasCodingProfiles) {
    score += 5;
  }

  return Math.min(100, Math.max(0, score));
};

// ==========================================
// JOB READINESS SCORE (0 - 100) & BREAKDOWN
// ==========================================
const calculateFresherJobReadiness = (profile, completion) => {
  const breakdown = {
    profileStrength: { score: completion, max: 100, weight: 20 },
    skillsScore: { score: 0, max: 100, weight: 25 },
    projectsScore: { score: 0, max: 100, weight: 20 },
    resumeScore: { score: 0, max: 100, weight: 15 },
    credentialsScore: { score: 0, max: 100, weight: 10 },
    preferencesScore: { score: 0, max: 100, weight: 10 },
  };

  // Skills scoring based on categorized proficiencies
  let skillsCount = 0;
  let advancedCount = 0;
  const categories = ["programmingLanguages", "frameworks", "databases", "tools", "softSkills", "technical"];
  categories.forEach((cat) => {
    const list = profile?.skills?.[cat] || [];
    skillsCount += list.length;
    advancedCount += list.filter((s) => s.proficiency === "Advanced" || s.proficiency === "Intermediate").length;
  });
  breakdown.skillsScore.score = Math.min(100, Math.round(skillsCount * 12 + advancedCount * 5));

  // Projects scoring
  const projects = profile?.projects || [];
  let projScore = 0;
  if (projects.length >= 1) projScore += 40;
  if (projects.length >= 2) projScore += 30;
  const hasLinks = projects.some((p) => p.githubUrl || p.liveUrl);
  if (hasLinks) projScore += 30;
  breakdown.projectsScore.score = Math.min(100, projScore);

  // Resume scoring
  const hasResume = !!(profile?.resume?.resumeUrl || profile?.resume?.resumeName || profile?.resume?.isGenerated);
  breakdown.resumeScore.score = hasResume ? 100 : 0;

  // Credentials (Certs, achievements, coding profiles, internships)
  let credScore = 0;
  if (profile?.certifications?.length > 0) credScore += 30;
  if (profile?.achievements?.length > 0) credScore += 25;
  if (profile?.codingProfiles?.length > 0) credScore += 25;
  if (profile?.internships?.length > 0) credScore += 20;
  breakdown.credentialsScore.score = Math.min(100, credScore);

  // Preferences & Availability
  let prefScore = 0;
  if (profile?.jobPreferences?.preferredRoles?.length > 0) prefScore += 40;
  if (profile?.jobPreferences?.preferredLocations?.length > 0) prefScore += 30;
  if (profile?.availability?.status) prefScore += 30;
  breakdown.preferencesScore.score = Math.min(100, prefScore);

  const totalScore = Math.round(
    breakdown.profileStrength.score * 0.2 +
      breakdown.skillsScore.score * 0.25 +
      breakdown.projectsScore.score * 0.2 +
      breakdown.resumeScore.score * 0.15 +
      breakdown.credentialsScore.score * 0.1 +
      breakdown.preferencesScore.score * 0.1
  );

  const tips = [];
  if (skillsCount < 5) tips.push("Add at least 5 key technical skills with proficiency levels.");
  if (projects.length < 2) tips.push("Add 2 or more projects with live demo or GitHub links.");
  if (!projects.some((p) => p.liveUrl)) tips.push("Include a live deployment link for your best project.");
  if (!hasResume) tips.push("Build or upload your resume to unlock 1-click recruiter applications.");
  if ((profile?.codingProfiles?.length || 0) === 0) tips.push("Connect your LeetCode, GitHub, or HackerRank profile to showcase coding agility.");
  if ((profile?.certifications?.length || 0) === 0 && (profile?.internships?.length || 0) === 0) {
    tips.push("Add a recognized certification or online course credential.");
  }
  if (!profile?.jobPreferences?.expectedSalary?.min) {
    tips.push("Specify your expected salary range to get accurately matched openings.");
  }

  return {
    score: Math.min(100, Math.max(0, totalScore)),
    breakdown,
    tips: tips.length > 0 ? tips : ["Your fresher profile is in top-tier shape! You are job-ready."],
  };
};

// Calculate match percentage against a job
const calculateJobMatch = (fresherProfile, jobRequiredSkills = [], jobRole = "") => {
  const allProfileSkills = [];
  const categories = ["programmingLanguages", "frameworks", "databases", "tools", "technical"];
  categories.forEach((cat) => {
    (fresherProfile?.skills?.[cat] || []).forEach((s) => allProfileSkills.push(s.name.toLowerCase()));
  });

  if (jobRequiredSkills.length === 0) return 85;

  let matched = 0;
  jobRequiredSkills.forEach((reqSkill) => {
    if (allProfileSkills.some((s) => s.includes(reqSkill.toLowerCase()) || reqSkill.toLowerCase().includes(s))) {
      matched += 1;
    }
  });

  let matchPct = Math.round((matched / jobRequiredSkills.length) * 100);
  // Give a slight boost if target role matches
  if (
    jobRole &&
    fresherProfile?.targetRole &&
    fresherProfile.targetRole.toLowerCase().includes(jobRole.toLowerCase())
  ) {
    matchPct = Math.min(100, matchPct + 10);
  }

  return Math.min(98, Math.max(45, matchPct));
};

// ==========================================
// GET FRESHER PROFILE
// ==========================================
module.exports.getFresherProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    let profile = await FresherProfile.findOne({ userId }).populate(
      "userId",
      "fullName email username phone profileImage role userType isProfileComplete profileCompletion socialLinks"
    );

    if (!profile) {
      // Auto initialize sensible fresher profile template
      profile = await FresherProfile.create({
        userId,
        professionalHeadline: "Software Engineering Graduate | Seeking Entry-Level Opportunities",
        targetRole: "Full Stack Developer",
        targetIndustry: "Information Technology",
        careerObjective:
          "Passionate graduate seeking an entry-level software engineering role where I can apply my problem-solving abilities and full-stack development skills.",
        education: [
          {
            qualificationType: "B.Tech",
            degree: "B.Tech Computer Science & Engineering",
            institution: "University / Institute of Technology",
            university: "State Technical University",
            graduationYear: 2024,
            percentageOrCgpa: "8.2 CGPA",
            isHighest: true,
          },
        ],
        skills: {
          programmingLanguages: [
            { name: "JavaScript", proficiency: "Intermediate" },
            { name: "Python", proficiency: "Intermediate" },
          ],
          frameworks: [
            { name: "React", proficiency: "Intermediate" },
            { name: "Node.js", proficiency: "Intermediate" },
            { name: "Express", proficiency: "Intermediate" },
          ],
          databases: [{ name: "MongoDB", proficiency: "Intermediate" }],
          tools: [{ name: "Git", proficiency: "Intermediate" }, { name: "Postman", proficiency: "Beginner" }],
          softSkills: [
            { name: "Problem Solving", proficiency: "Advanced" },
            { name: "Teamwork", proficiency: "Advanced" },
            { name: "Communication", proficiency: "Intermediate" },
          ],
          technical: [],
        },
        jobPreferences: {
          preferredRoles: ["Full Stack Developer", "Frontend Developer", "Junior Software Engineer"],
          employmentTypes: ["Full-time", "Internship", "Graduate Trainee"],
          preferredLocations: ["Bangalore", "Hyderabad", "Pune", "Remote"],
          workMode: ["Hybrid", "Remote", "On-site"],
          expectedSalary: { min: 4.5, max: 8.5, currency: "INR (LPA)" },
        },
        availability: {
          status: "Immediately Available",
          currentEmploymentStatus: "Looking for Job",
        },
        profileVisibility: "public",
      });

      profile = await profile.populate(
        "userId",
        "fullName email username phone profileImage role userType isProfileComplete profileCompletion socialLinks"
      );
    }

    const completion = calculateFresherProfileCompletion(profile, req.user);
    const readiness = calculateFresherJobReadiness(profile, completion);

    return res.status(200).json({
      success: true,
      profile,
      profileCompletion: completion,
      jobReadiness: readiness,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// UPDATE FRESHER PROFILE
// ==========================================
module.exports.updateFresherProfile = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const updateData = { ...req.body };

    // Synchronize basic user fields if present in updateData
    const userUpdateFields = {};
    if (updateData.fullName) userUpdateFields.fullName = updateData.fullName.trim();
    if (updateData.phone !== undefined) userUpdateFields.phone = updateData.phone.trim();
    if (updateData.profileImage !== undefined) userUpdateFields.profileImage = updateData.profileImage;
    if (updateData.socialLinks) {
      userUpdateFields.socialLinks = {
        linkedin: updateData.socialLinks.linkedin || "",
        github: updateData.socialLinks.github || "",
      };
    }

    let profile = await FresherProfile.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true, upsert: true, runValidators: true }
    ).populate(
      "userId",
      "fullName email username phone profileImage role userType isProfileComplete profileCompletion socialLinks"
    );

    // Calculate updated completion & readiness
    const completion = calculateFresherProfileCompletion(profile, req.user);
    const readiness = calculateFresherJobReadiness(profile, completion);
    const isComplete = completion >= 75;

    profile.profileCompletion = completion;
    profile.jobReadinessScore = readiness.score;
    profile.isProfileComplete = isComplete;
    await profile.save();

    userUpdateFields.profileCompletion = completion;
    userUpdateFields.isProfileComplete = isComplete;

    if (Object.keys(userUpdateFields).length > 0) {
      await User.findByIdAndUpdate(userId, { $set: userUpdateFields });
    }

    return res.status(200).json({
      success: true,
      message: "Fresher profile updated successfully",
      profile,
      profileCompletion: completion,
      jobReadiness: readiness,
      isProfileComplete: isComplete,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// GET FRESHER DASHBOARD DATA
// ==========================================
module.exports.getFresherDashboard = async (req, res, next) => {
  try {
    const userId = req.user._id;
    let profile = await FresherProfile.findOne({ userId }).populate(
      "userId",
      "fullName email username phone profileImage role userType isProfileComplete profileCompletion socialLinks"
    );

    if (!profile) {
      profile = await FresherProfile.create({
        userId,
        professionalHeadline: "Software Engineering Graduate",
        targetRole: "Full Stack Developer",
        education: [
          {
            qualificationType: "B.Tech",
            degree: "B.Tech Computer Science",
            institution: "University / College",
            graduationYear: 2024,
            isHighest: true,
          },
        ],
        skills: {
          programmingLanguages: [{ name: "JavaScript", proficiency: "Intermediate" }],
          frameworks: [{ name: "React", proficiency: "Intermediate" }],
          databases: [{ name: "MongoDB", proficiency: "Intermediate" }],
          tools: [{ name: "Git", proficiency: "Intermediate" }],
          softSkills: [{ name: "Problem Solving", proficiency: "Intermediate" }],
          technical: [],
        },
      });
      profile = await profile.populate(
        "userId",
        "fullName email username phone profileImage role userType isProfileComplete profileCompletion socialLinks"
      );
    }

    const completion = calculateFresherProfileCompletion(profile, req.user);
    const readiness = calculateFresherJobReadiness(profile, completion);

    // Curated entry-level job listings tailored for freshers
    const rawJobs = [
      {
        id: "fjob-101",
        title: "Associate Software Engineer (2024 / 2025 Batch)",
        company: "NexGen Cloud Labs",
        location: "Bangalore (Hybrid)",
        salary: "₹6.5 - 9.0 LPA",
        type: "Full-Time",
        workMode: "Hybrid",
        experienceRequired: "Fresher / 0-1 Yr",
        skillsRequired: ["JavaScript", "React", "Node.js", "Git"],
        postedAt: "Just now",
        deadline: "05 Sep 2026",
      },
      {
        id: "fjob-102",
        title: "Junior Full Stack Developer (MERN)",
        company: "InnovateX Solutions",
        location: "Remote / Pune",
        salary: "₹5.5 - 8.0 LPA",
        type: "Full-Time",
        workMode: "Remote",
        experienceRequired: "Fresher",
        skillsRequired: ["React", "Node.js", "Express", "MongoDB"],
        postedAt: "1 day ago",
        deadline: "10 Sep 2026",
      },
      {
        id: "fjob-103",
        title: "Graduate Engineer Trainee (GET)",
        company: "Cognitive Technologies",
        location: "Hyderabad",
        salary: "₹7.0 - 10.5 LPA",
        type: "Graduate Trainee",
        workMode: "On-site",
        experienceRequired: "Fresher",
        skillsRequired: ["Python", "SQL", "Data Structures", "OOP"],
        postedAt: "2 days ago",
        deadline: "12 Sep 2026",
      },
      {
        id: "fjob-104",
        title: "Junior Frontend Engineer",
        company: "ScaleFlow Systems",
        location: "Gurgaon / Delhi NCR",
        salary: "₹5.0 - 7.5 LPA",
        type: "Full-Time",
        workMode: "Hybrid",
        experienceRequired: "Fresher / 0-1 Yr",
        skillsRequired: ["JavaScript", "HTML", "CSS", "React", "Tailwind CSS"],
        postedAt: "3 days ago",
        deadline: "15 Sep 2026",
      },
    ];

    // Compute dynamic match percentages for each job
    const recommendedJobs = rawJobs.map((job) => ({
      ...job,
      matchPercentage: calculateJobMatch(profile, job.skillsRequired, job.title),
    }));

    // Curated Intern-to-Hire & Apprenticeships for Freshers
    const recommendedInternships = [
      {
        id: "fint-201",
        title: "Full Stack Engineer (Intern to Full-Time)",
        company: "GrowthStack Labs",
        location: "Remote",
        stipend: "₹30,000 / month (Converts to ₹8 LPA)",
        duration: "3 Months",
        type: "Internship",
        workMode: "Remote",
        skillsRequired: ["React", "Node.js", "MongoDB"],
        deadline: "31 Aug 2026",
      },
      {
        id: "fint-202",
        title: "Backend Development Apprenticeship",
        company: "RazorFlow Tech",
        location: "Bangalore",
        stipend: "₹28,000 / month",
        duration: "6 Months",
        type: "Apprenticeship",
        workMode: "Hybrid",
        skillsRequired: ["Node.js", "Express", "SQL", "Git"],
        deadline: "04 Sep 2026",
      },
    ];

    // Application statistics
    const applications = {
      stats: {
        applied: 6,
        underReview: 3,
        shortlisted: 2,
        interview: 1,
        selected: 0,
      },
      recent: [
        {
          id: "app-f1",
          title: "Associate Software Engineer",
          company: "NexGen Cloud Labs",
          appliedDate: "25 Aug 2026",
          status: "Under Review",
        },
        {
          id: "app-f2",
          title: "Junior Full Stack Developer",
          company: "InnovateX Solutions",
          appliedDate: "22 Aug 2026",
          status: "Shortlisted 🎉",
        },
      ],
    };

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
          socialLinks: req.user.socialLinks,
        },
        profile,
        profileCompletion: completion,
        jobReadiness: readiness,
        recommendedJobs,
        recommendedInternships,
        applications,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// GET FRESHER RECOMMENDATIONS (Courses & Roles)
// ==========================================
module.exports.getFresherRecommendations = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const profile = await FresherProfile.findOne({ userId });

    const targetRole = profile?.targetRole || profile?.jobPreferences?.preferredRoles?.[0] || "Full Stack Developer";
    const benchmarkSkills = ROLE_SKILL_BENCHMARKS[targetRole] || ROLE_SKILL_BENCHMARKS["Full Stack Developer"];

    const allProfileSkills = [];
    const categories = ["programmingLanguages", "frameworks", "databases", "tools", "technical"];
    categories.forEach((cat) => {
      (profile?.skills?.[cat] || []).forEach((s) => allProfileSkills.push(s.name.toLowerCase()));
    });

    const mastered = [];
    const missing = [];

    benchmarkSkills.forEach((skill) => {
      if (allProfileSkills.includes(skill.toLowerCase())) {
        mastered.push(skill);
      } else {
        missing.push(skill);
      }
    });

    const skillGapCourses = [
      {
        id: "crs-f1",
        title: `Industry-Ready ${targetRole} FastTrack`,
        provider: "CareerConnect Pro",
        duration: "4 Weeks",
        rating: 4.9,
        skillsCovered: missing.slice(0, 3),
        isFree: true,
      },
      {
        id: "crs-f2",
        title: "Cracking the Coding Interview & System Design",
        provider: "AlgoPrep Academy",
        duration: "6 Weeks",
        rating: 4.8,
        skillsCovered: ["Data Structures", "Algorithms", "System Architecture"],
        isFree: true,
      },
    ];

    return res.status(200).json({
      success: true,
      data: {
        targetRole,
        masteredSkills: mastered,
        skillsToLearn: missing,
        matchPercentage: Math.round((mastered.length / benchmarkSkills.length) * 100),
        recommendedCourses: skillGapCourses,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// GET PUBLIC FRESHER PROFILE
// ==========================================
module.exports.getPublicFresherProfile = async (req, res, next) => {
  try {
    const { usernameOrId } = req.params;

    let user = null;
    if (usernameOrId.match(/^[0-9a-fA-F]{24}$/)) {
      user = await User.findById(usernameOrId).select("fullName username email phone profileImage socialLinks userType");
    }
    if (!user) {
      user = await User.findOne({ username: usernameOrId.toLowerCase() }).select(
        "fullName username email phone profileImage socialLinks userType"
      );
    }

    if (!user || user.userType !== "fresher") {
      return res.status(404).json({
        success: false,
        message: "Fresher public profile not found",
      });
    }

    const profile = await FresherProfile.findOne({ userId: user._id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile has not been created yet",
      });
    }

    if (profile.profileVisibility === "private") {
      return res.status(403).json({
        success: false,
        message: "This profile is private and cannot be viewed publicly.",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        user,
        profile,
      },
    });
  } catch (error) {
    next(error);
  }
};
