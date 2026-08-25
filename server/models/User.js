const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// ==========================================
// EDUCATION SUB-SCHEMA
// ==========================================
const educationSchema = new mongoose.Schema(
  {
    institution: {
      type: String,
      required: [true, "Institution name is required"],
      trim: true,
      maxlength: [150, "Institution name cannot exceed 150 characters"],
    },

    degree: {
      type: String,
      required: [true, "Degree is required"],
      trim: true,
      maxlength: [100, "Degree cannot exceed 100 characters"],
    },

    fieldOfStudy: {
      type: String,
      trim: true,
      maxlength: [100, "Field of study cannot exceed 100 characters"],
    },

    startYear: {
      type: Number,
      min: [1950, "Invalid start year"],
      max: [2100, "Invalid start year"],
    },

    endYear: {
      type: Number,
      min: [1950, "Invalid end year"],
      max: [2100, "Invalid end year"],
    },

    grade: {
      type: String,
      trim: true,
      maxlength: [20, "Grade cannot exceed 20 characters"],
    },
  },
  { _id: false }
);

// ==========================================
// EXPERIENCE SUB-SCHEMA
// ==========================================
const experienceSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
      maxlength: [150, "Company name cannot exceed 150 characters"],
    },

    jobTitle: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      maxlength: [100, "Job title cannot exceed 100 characters"],
    },

    startDate: {
      type: Date,
    },

    endDate: {
      type: Date,
    },

    currentlyWorking: {
      type: Boolean,
      default: false,
    },

    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
  },
  { _id: false }
);

// ==========================================
// USER SCHEMA
// ==========================================
const userSchema = new mongoose.Schema(
  {
    // ==========================================
    // BASIC INFORMATION
    // ==========================================

    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [2, "Full name must contain at least 2 characters"],
      maxlength: [100, "Full name cannot exceed 100 characters"],
    },

    username: {
      type: String,
      unique: true,
      sparse: true, // allows null/undefined values
      lowercase: true,
      trim: true,
      minlength: [3, "Username must contain at least 3 characters"],
      maxlength: [30, "Username cannot exceed 30 characters"],
      match: [
        /^[a-z0-9_]+$/,
        "Username can only contain lowercase letters, numbers and underscore",
      ],
      index: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please enter a valid email address",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    profileImage: {
      type: String,
      default: "",
      trim: true,
    },

    // ==========================================
    // SOCIAL LINKS
    // ==========================================

    socialLinks: {
      linkedin: {
        type: String,
        default: "",
        trim: true,
      },
      github: {
        type: String,
        default: "",
        trim: true,
      },
    },

    // ==========================================
    // ROLE & USER TYPE
    // ==========================================

    role: {
      type: String,
      enum: {
        values: ["user", "admin", "employer"],
        message: "Invalid user role",
      },
      default: "user",
      index: true,
    },

    // student | fresher | professional
    experienceLevel: {
      type: String,
      enum: [
        "student",
        "fresher",
        "professional",
        "0-1 years",
        "1-3 years",
        "3-5 years",
        "5+ years",
      ],
      default: null,
    },

    // ==========================================
    // PERSONAL INFORMATION
    // ==========================================

    dateOfBirth: {
      type: Date,
    },

    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer-not-to-say"],
    },

    location: {
      city: {
        type: String,
        trim: true,
      },
      state: {
        type: String,
        trim: true,
      },
      country: {
        type: String,
        default: "India",
        trim: true,
      },
    },

    bio: {
      type: String,
      default: "",
      trim: true,
      maxlength: [500, "Bio cannot exceed 500 characters"],
    },

    // ==========================================
    // CAREER INFORMATION
    // ==========================================

    careerGoal: {
      type: String,
      trim: true,
      maxlength: [100, "Career goal cannot exceed 100 characters"],
      index: true,
    },

    interests: [
      {
        type: String,
        trim: true,
        maxlength: [50, "Interest cannot exceed 50 characters"],
      },
    ],

    skills: [
      {
        type: String,
        trim: true,
        maxlength: [50, "Skill cannot exceed 50 characters"],
      },
    ],

    // ==========================================
    // EDUCATION
    // ==========================================

    education: {
      type: [educationSchema],
      default: [],
    },

    // ==========================================
    // EXPERIENCE
    // ==========================================

    experience: {
      type: [experienceSchema],
      default: [],
    },

    // ==========================================
    // JOB PREFERENCES
    // ==========================================

    jobPreferences: {
      jobTypes: [
        {
          type: String,
          enum: ["full-time", "part-time", "internship", "freelance"],
        },
      ],

      preferredLocations: [
        {
          type: String,
          trim: true,
        },
      ],

      remote: {
        type: Boolean,
        default: false,
      },

      expectedSalary: {
        min: {
          type: Number,
          min: [0, "Salary cannot be negative"],
          default: 0,
        },
        max: {
          type: Number,
          min: [0, "Salary cannot be negative"],
          default: 0,
        },
      },
    },

    // ==========================================
    // PROFILE STATUS
    // ==========================================

    profileCompletion: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    isProfileComplete: {
      type: Boolean,
      default: false,
    },

    // ==========================================
    // ACCOUNT STATUS
    // ==========================================

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// ==========================================
// INDEXES
// ==========================================

userSchema.index({
  careerGoal: 1,
  skills: 1,
});

userSchema.index({
  "location.city": 1,
  "location.state": 1,
});

// ==========================================
// PASSWORD HASHING
// ==========================================

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// ==========================================
// PASSWORD COMPARISON
// ==========================================

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;