const User = require("../models/User.js");
const StudentProfile = require("../models/StudentProfile.js");
const FresherProfile = require("../models/FresherProfile.js");
const ProfessionalProfile = require("../models/ProfessionalProfile.js");
const jwt = require("jsonwebtoken");

// Generate JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Set cookie
const setTokenCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// Helper: Generate username from email
const generateUsername = (email) => {
  const base = email.split("@")[0].toLowerCase().replace(/[^a-z0-9]/g, "");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `${base}${random}`;
};

// ==========================================
// REGISTER (Multi-step form ke hisaab se)
// ==========================================
module.exports.registerUser = async (req, res, next) => {
  try {
    const {
      fullName,
      email,
      phone,
      password,
      confirmPassword,
      linkedin,
      github,
      userType, // student | fresher | professional

      // Student fields
      college,
      course,
      year,
      graduationYear,

      // Fresher fields
      highestQualification,
      passoutYear,
      skills,

      // Professional fields
      currentCompany,
      jobTitle,
      experienceYears,
      industry,
    } = req.body;

    // -------------------- Validation --------------------
    if (!fullName?.trim()) {
      return res.status(400).json({
        success: false,
        field: "fullName",
        message: "Full name is required",
      });
    }

    if (!email?.trim()) {
      return res.status(400).json({
        success: false,
        field: "email",
        message: "Email is required",
      });
    }

    if (!phone?.trim()) {
      return res.status(400).json({
        success: false,
        field: "phone",
        message: "Phone number is required",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        field: "password",
        message: "Password is required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        field: "password",
        message: "Password must contain at least 6 characters",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        field: "confirmPassword",
        message: "Passwords do not match",
      });
    }

    if (!userType || !["student", "fresher", "professional"].includes(userType)) {
      return res.status(400).json({
        success: false,
        field: "userType",
        message: "Please select a valid user type",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if email already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        field: "email",
        message: "Email is already registered",
      });
    }

    // -------------------- Prepare user data --------------------
    const userData = {
      fullName: fullName.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      password,
      userType,
      socialLinks: {
        linkedin: linkedin?.trim() || "",
        github: github?.trim() || "",
      },
      role: "user",
      username: generateUsername(normalizedEmail), // auto generate
    };

    // -------------------- Validate type-specific data --------------------
    if (userType === "student") {
      if (!college || !course || !year || !graduationYear) {
        return res.status(400).json({
          success: false,
          message: "College, course, year and graduation year are required for students",
        });
      }
    } else if (userType === "fresher") {
      if (!highestQualification || !passoutYear) {
        return res.status(400).json({
          success: false,
          message: "Highest qualification and passout year are required for freshers",
        });
      }
    } else if (userType === "professional") {
      if (!currentCompany || !jobTitle) {
        return res.status(400).json({
          success: false,
          message: "Current company and job title are required for professionals",
        });
      }
    }

    // -------------------- Create user --------------------
    const user = await User.create(userData);

    // -------------------- Create student profile if student --------------------
    if (userType === "student") {
      try {
        await StudentProfile.create({
          userId: user._id,
          education: [
            {
              institution: college.trim(),
              degree: course.trim(),
              startYear: Number(graduationYear) - Number(year),
              endYear: Number(graduationYear),
              currentlyStudying: true,
            },
          ],
        });
      } catch (profileErr) {
        console.error("Error creating student profile during registration:", profileErr);
      }
    } else if (userType === "fresher") {
      try {
        const skillsList = typeof skills === "string" && skills.trim()
          ? skills.split(",").map((s) => ({ name: s.trim(), proficiency: "Intermediate" })).filter((s) => s.name)
          : [{ name: "JavaScript", proficiency: "Intermediate" }, { name: "React", proficiency: "Intermediate" }];

        await FresherProfile.create({
          userId: user._id,
          education: [
            {
              qualificationType: "B.Tech",
              degree: highestQualification ? highestQualification.trim() : "Bachelor Degree",
              institution: "College / University",
              graduationYear: passoutYear ? Number(passoutYear) : 2024,
              isHighest: true,
            },
          ],
          skills: {
            programmingLanguages: skillsList.slice(0, 2),
            frameworks: skillsList.slice(2, 4),
            databases: [{ name: "MongoDB", proficiency: "Intermediate" }],
            tools: [{ name: "Git", proficiency: "Intermediate" }],
            softSkills: [{ name: "Problem Solving", proficiency: "Advanced" }],
            technical: [],
          },
          jobPreferences: {
            preferredRoles: ["Full Stack Developer", "Junior Software Engineer"],
            employmentTypes: ["Full-time", "Internship"],
            preferredLocations: ["Bangalore", "Hyderabad", "Pune", "Remote"],
            workMode: ["Hybrid", "Remote"],
            expectedSalary: { min: 4.5, max: 8.0, currency: "INR (LPA)" },
          },
        });
      } catch (fresherErr) {
        console.error("Error creating fresher profile during registration:", fresherErr);
      }
    } else if (userType === "professional") {
      try {
        await ProfessionalProfile.create({
          userId: user._id,
          professionalHeadline: `${jobTitle || "Software Engineer"} at ${currentCompany || "Technology Company"}`,
          careerSpecialization: industry || "Information Technology",
          currentEmployment: {
            company: currentCompany ? currentCompany.trim() : "Current Company",
            jobTitle: jobTitle ? jobTitle.trim() : "Senior Software Engineer",
            industry: industry ? industry.trim() : "Information Technology",
            department: "Engineering",
            currentlyWorking: true,
            joiningDate: new Date(),
          },
          experience: [
            {
              companyName: currentCompany ? currentCompany.trim() : "Current Company",
              jobTitle: jobTitle ? jobTitle.trim() : "Senior Software Engineer",
              startDate: new Date(),
              currentlyWorking: true,
              description: `Working as ${jobTitle || "Engineer"} at ${currentCompany || "Company"}.`,
            },
          ],
          totalExperienceYears: parseInt(experienceYears) || 3,
          experienceLevelCategory: experienceYears || "3-5 years",
          jobSearchStatus: "Open to Opportunities",
          profileVisibility: "recruiter-only",
        });
      } catch (proErr) {
        console.error("Error creating professional profile during registration:", proErr);
      }
    }

    const token = generateToken(user._id);
    setTokenCookie(res, token);

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      token,
      user: {
        _id: user._id,
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        phone: user.phone,
        profileImage: user.profileImage,
        role: user.role,
        userType: user.userType,
        profileCompletion: user.profileCompletion || 0,
        isProfileComplete: user.isProfileComplete || false,
        socialLinks: user.socialLinks,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// LOGIN
// ==========================================
module.exports.loginUser = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;

    // Frontend se emailOrUsername bhi aa sakta hai
    const loginIdentifier = email || username || req.body.emailOrUsername;

    if (!loginIdentifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Email/username and password are required",
      });
    }

    const loginValue = loginIdentifier.trim().toLowerCase();

    const user = await User.findOne({
      $or: [{ email: loginValue }, { username: loginValue }],
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    // Update lastLogin
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id);
    setTokenCookie(res, token);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        phone: user.phone,
        profileImage: user.profileImage,
        role: user.role,
        userType: user.userType,
        profileCompletion: user.profileCompletion || 0,
        isProfileComplete: user.isProfileComplete || false,
        socialLinks: user.socialLinks,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// LOGOUT
// ==========================================
module.exports.logoutUser = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  return res.status(200).json({
    success: true,
    message: "Logout successful",
  });
};

// ==========================================
// GET ME (Current logged in user)
// ==========================================
module.exports.getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: {
      _id: req.user._id,
      id: req.user._id,
      fullName: req.user.fullName,
      username: req.user.username,
      email: req.user.email,
      phone: req.user.phone,
      profileImage: req.user.profileImage,
      role: req.user.role,
      userType: req.user.userType,
      profileCompletion: req.user.profileCompletion || 0,
      isProfileComplete: req.user.isProfileComplete || false,
      socialLinks: req.user.socialLinks,
      isActive: req.user.isActive,
    },
  });
};

// ==========================================
// UPDATE USER TYPE / EXPERIENCE LEVEL
// ==========================================
module.exports.updateExperienceLevel = async (req, res, next) => {
  try {
    const { userType, experienceLevel } = req.body;
    const selectedType = userType || experienceLevel;

    const allowed = ["student", "fresher", "professional"];
    if (!allowed.includes(selectedType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user type. Allowed: student, fresher, professional",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        userType: selectedType,
      },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User type updated successfully",
      user: {
        _id: user._id,
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        userType: user.userType,
        profileCompletion: user.profileCompletion || 0,
        isProfileComplete: user.isProfileComplete || false,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// CHECK EMAIL
// ==========================================
module.exports.checkEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ exists: false });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    return res.status(200).json({
      exists: !!user,
    });
  } catch (error) {
    return res.status(200).json({ exists: false });
  }
};