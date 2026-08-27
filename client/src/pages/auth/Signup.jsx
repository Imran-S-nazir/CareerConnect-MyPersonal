import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signupStart,
  signupSuccess,
  signupFailure,
  clearMessages,
} from "../../redux/features/authSlice";
import api from "../../api/api";
import { getDashboardPath } from "../../utils/dashboardRedirect";

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState("next");
  const [userType, setUserType] = useState("");
  const [checkingEmail, setCheckingEmail] = useState(false);

  // Field-level errors
  const [fieldErrors, setFieldErrors] = useState({});

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    linkedin: "",
    github: "",
    college: "",
    course: "",
    year: "",
    graduationYear: "",
    highestQualification: "",
    passoutYear: "",
    skills: "",
    currentCompany: "",
    jobTitle: "",
    experienceYears: "",
    industry: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear that field error while typing
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (error) dispatch(clearMessages());
  };

  // -------------------- VALIDATION HELPERS --------------------
  const validateStep1 = async () => {
    const errors = {};

    if (!formData.fullName.trim()) {
      errors.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      errors.fullName = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Mobile number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\D/g, "").slice(-10))) {
      errors.phone = "Please enter a valid 10-digit mobile number";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return false;
    }

    // Check if email already exists in database
    try {
      setCheckingEmail(true);
      const res = await api.post("/auth/check-email", {
        email: formData.email.trim().toLowerCase(),
      });

      if (res.data.exists) {
        setFieldErrors({ email: "This email is already registered" });
        return false;
      }
    } catch (err) {
      // Agar check-email API nahi bani to ignore, register pe check ho jayega
      console.log("Email check skipped");
    } finally {
      setCheckingEmail(false);
    }

    return true;
  };

  const validateStep3 = () => {
    const errors = {};

    if (userType === "student") {
      if (!formData.college.trim()) errors.college = "College name is required";
      if (!formData.course.trim()) errors.course = "Course is required";
      if (!formData.year) errors.year = "Please select current year";
      if (!formData.graduationYear) {
        errors.graduationYear = "Graduation year is required";
      }
    }

    if (userType === "fresher") {
      if (!formData.highestQualification.trim()) {
        errors.highestQualification = "Qualification is required";
      }
      if (!formData.passoutYear) {
        errors.passoutYear = "Passout year is required";
      }
    }

    if (userType === "professional") {
      if (!formData.currentCompany.trim()) {
        errors.currentCompany = "Company name is required";
      }
      if (!formData.jobTitle.trim()) {
        errors.jobTitle = "Job title is required";
      }
      if (!formData.experienceYears) {
        errors.experienceYears = "Please select experience";
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // -------------------- NAVIGATION --------------------
  const goNext = () => {
    setDirection("next");
    setStep((s) => s + 1);
    setFieldErrors({});
  };

  const goBack = () => {
    setDirection("prev");
    setStep((s) => s - 1);
    setFieldErrors({});
  };

  const handleStep1Next = async () => {
    const isValid = await validateStep1();
    if (isValid) {
      goNext();
    }
  };

  const handleSelectType = (type) => {
    setUserType(type);
    goNext();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep3()) return;

    dispatch(signupStart());

    try {
      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        linkedin: formData.linkedin.trim(),
        github: formData.github.trim(),
        userType,
      };

      if (userType === "student") {
        Object.assign(payload, {
          college: formData.college.trim(),
          course: formData.course.trim(),
          year: formData.year,
          graduationYear: formData.graduationYear,
        });
      } else if (userType === "fresher") {
        Object.assign(payload, {
          highestQualification: formData.highestQualification.trim(),
          passoutYear: formData.passoutYear,
          skills: formData.skills.trim(),
        });
      } else {
        Object.assign(payload, {
          currentCompany: formData.currentCompany.trim(),
          jobTitle: formData.jobTitle.trim(),
          experienceYears: formData.experienceYears,
          industry: formData.industry.trim(),
        });
      }

      const res = await api.post("/auth/register", payload);
      dispatch(signupSuccess({ user: res.data.user }));
      const dest = getDashboardPath(res.data.user?.userType || userType);
      navigate(dest, { replace: true });
    } catch (err) {
      const message =
        err.response?.data?.message || "Registration failed. Please try again.";
      dispatch(signupFailure(message));

      // Agar backend field error bheje
      if (err.response?.data?.field) {
        setFieldErrors({
          [err.response.data.field]: err.response.data.message,
        });
      }
    }
  };

  const slideClass =
    direction === "next" ? "animate-slide-in-right" : "animate-slide-in-left";

  // Helper for input class
  const inputClass = (field) =>
    `w-full h-11 rounded-xl border bg-white px-4 text-sm outline-none transition focus:ring-4 ${
      fieldErrors[field]
        ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
        : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
    }`;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* LEFT PANEL - Only Step 1 */}
      {step === 1 && (
        <div className="hidden lg:flex w-[42%] bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white p-12 flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-indigo-500/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

          <div className="relative z-10">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-600/30">
                C
              </div>
              <div>
                <h1 className="text-xl font-semibold tracking-tight">CareerConnect</h1>
                <p className="text-xs text-slate-400">Career & Opportunity Platform</p>
              </div>
            </Link>
          </div>

          <div className="relative z-10">
            <h2 className="text-4xl font-semibold leading-tight tracking-tight mb-5">
              Build your future.<br />
              <span className="text-blue-400">One step at a time.</span>
            </h2>
            <p className="text-slate-300 text-[15px] leading-relaxed max-w-sm">
              Create your account and unlock opportunities tailored for students, freshers and professionals.
            </p>
          </div>

          <div className="relative z-10 text-sm text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="text-white font-medium hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      )}

      {/* RIGHT / FULL CONTENT */}
      <div className={`flex-1 flex items-center justify-center p-6 sm:p-10 ${step === 1 ? "" : "w-full"}`}>
        <div className={`w-full ${step === 1 ? "max-w-md" : "max-w-2xl"}`}>
          
          {/* Progress */}
          <div className="flex items-center gap-2 mb-10 max-w-md mx-auto">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2 flex-1 last:flex-none">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                    step >= s ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500"
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div className={`h-0.5 flex-1 rounded transition-all ${step > s ? "bg-blue-600" : "bg-slate-200"}`} />
                )}
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 max-w-md mx-auto">
              {error}
            </div>
          )}

          {/* ================= STEP 1 ================= */}
          {step === 1 && (
            <div key="step1" className={slideClass}>
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">
                  Create your account
                </h2>
                <p className="text-sm text-slate-500 mt-1.5">
                  Let’s start with the basics
                </p>
              </div>

              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Full Name
                  </label>
                  <input
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={inputClass("fullName")}
                  />
                  {fieldErrors.fullName && (
                    <p className="text-xs text-red-500 mt-1.5">{fieldErrors.fullName}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className={inputClass("email")}
                  />
                  {fieldErrors.email && (
                    <p className="text-xs text-red-500 mt-1.5">{fieldErrors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Mobile
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className={inputClass("phone")}
                  />
                  {fieldErrors.phone && (
                    <p className="text-xs text-red-500 mt-1.5">{fieldErrors.phone}</p>
                  )}
                </div>

                {/* Password + Confirm */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={inputClass("password")}
                    />
                    {fieldErrors.password && (
                      <p className="text-xs text-red-500 mt-1.5">{fieldErrors.password}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      Confirm
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className={inputClass("confirmPassword")}
                    />
                    {fieldErrors.confirmPassword && (
                      <p className="text-xs text-red-500 mt-1.5">{fieldErrors.confirmPassword}</p>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleStep1Next}
                  disabled={checkingEmail}
                  className="w-full h-11 mt-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold transition shadow-sm flex items-center justify-center gap-2"
                >
                  {checkingEmail ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Checking...
                    </>
                  ) : (
                    "Continue"
                  )}
                </button>
              </div>

              <p className="lg:hidden text-center text-sm text-slate-500 mt-8">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-blue-600">
                  Sign in
                </Link>
              </p>
            </div>
          )}

          {/* ================= STEP 2 ================= */}
          {step === 2 && (
            <div key="step2" className={slideClass}>
              <button
                onClick={goBack}
                className="text-sm text-slate-500 hover:text-slate-700 mb-6 flex items-center gap-1"
              >
                ← Back
              </button>

              <div className="mb-8 text-center">
                <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
                  What best describes you?
                </h2>
                <p className="text-sm text-slate-500 mt-2">
                  Select the option that matches your current stage
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    id: "student",
                    title: "Student",
                    desc: "Currently studying in college/university and looking for internships or early opportunities.",
                    color: "blue",
                  },
                  {
                    id: "fresher",
                    title: "Fresher",
                    desc: "Recently graduated and ready to start your professional career with entry-level roles.",
                    color: "emerald",
                  },
                  {
                    id: "professional",
                    title: "Working Professional",
                    desc: "Already working and looking for better opportunities, career growth or a job switch.",
                    color: "violet",
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleSelectType(item.id)}
                    className="group p-6 rounded-2xl border-2 border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition text-left"
                  >
                    <div
                      className={`w-12 h-12 mb-4 rounded-xl flex items-center justify-center transition
                        ${item.color === "blue" ? "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white" : ""}
                        ${item.color === "emerald" ? "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white" : ""}
                        ${item.color === "violet" ? "bg-violet-50 text-violet-600 group-hover:bg-violet-600 group-hover:text-white" : ""}
                      `}
                    >
                      {item.id === "student" && (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 14l9-5-9-5-9 5 9 5z" />
                        </svg>
                      )}
                      {item.id === "fresher" && (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      )}
                      {item.id === "professional" && (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {item.desc}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ================= STEP 3 ================= */}
          {step === 3 && (
            <div key="step3" className={`${slideClass} max-w-md mx-auto`}>
              <button
                onClick={goBack}
                className="text-sm text-slate-500 hover:text-slate-700 mb-6 flex items-center gap-1"
              >
                ← Back
              </button>

              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-slate-900 tracking-tight">
                  {userType === "student" && "Your education details"}
                  {userType === "fresher" && "Your background"}
                  {userType === "professional" && "Your work experience"}
                </h2>
                <p className="text-sm text-slate-500 mt-1.5">
                  Almost done — just a few more details
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* STUDENT */}
                {userType === "student" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        College / University
                      </label>
                      <input
                        name="college"
                        value={formData.college}
                        onChange={handleChange}
                        placeholder="College name"
                        className={inputClass("college")}
                      />
                      {fieldErrors.college && (
                        <p className="text-xs text-red-500 mt-1.5">{fieldErrors.college}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Course
                      </label>
                      <input
                        name="course"
                        value={formData.course}
                        onChange={handleChange}
                        placeholder="B.Tech Computer Science"
                        className={inputClass("course")}
                      />
                      {fieldErrors.course && (
                        <p className="text-xs text-red-500 mt-1.5">{fieldErrors.course}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          Current Year
                        </label>
                        <select
                          name="year"
                          value={formData.year}
                          onChange={handleChange}
                          className={inputClass("year") + " bg-white"}
                        >
                          <option value="">Select</option>
                          <option value="1">1st Year</option>
                          <option value="2">2nd Year</option>
                          <option value="3">3rd Year</option>
                          <option value="4">4th Year</option>
                        </select>
                        {fieldErrors.year && (
                          <p className="text-xs text-red-500 mt-1.5">{fieldErrors.year}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          Graduation Year
                        </label>
                        <input
                          type="number"
                          name="graduationYear"
                          value={formData.graduationYear}
                          onChange={handleChange}
                          placeholder="2027"
                          className={inputClass("graduationYear")}
                        />
                        {fieldErrors.graduationYear && (
                          <p className="text-xs text-red-500 mt-1.5">{fieldErrors.graduationYear}</p>
                        )}
                      </div>
                    </div>
                  </>
                )}

                {/* FRESHER */}
                {userType === "fresher" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Highest Qualification
                      </label>
                      <input
                        name="highestQualification"
                        value={formData.highestQualification}
                        onChange={handleChange}
                        placeholder="B.Tech / BCA / MCA"
                        className={inputClass("highestQualification")}
                      />
                      {fieldErrors.highestQualification && (
                        <p className="text-xs text-red-500 mt-1.5">{fieldErrors.highestQualification}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Passout Year
                      </label>
                      <input
                        type="number"
                        name="passoutYear"
                        value={formData.passoutYear}
                        onChange={handleChange}
                        placeholder="2024"
                        className={inputClass("passoutYear")}
                      />
                      {fieldErrors.passoutYear && (
                        <p className="text-xs text-red-500 mt-1.5">{fieldErrors.passoutYear}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Key Skills
                      </label>
                      <input
                        name="skills"
                        value={formData.skills}
                        onChange={handleChange}
                        placeholder="React, Node.js, Python..."
                        className={inputClass("skills")}
                      />
                    </div>
                  </>
                )}

                {/* PROFESSIONAL */}
                {userType === "professional" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Current Company
                      </label>
                      <input
                        name="currentCompany"
                        value={formData.currentCompany}
                        onChange={handleChange}
                        placeholder="Company name"
                        className={inputClass("currentCompany")}
                      />
                      {fieldErrors.currentCompany && (
                        <p className="text-xs text-red-500 mt-1.5">{fieldErrors.currentCompany}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Job Title
                      </label>
                      <input
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleChange}
                        placeholder="Software Engineer"
                        className={inputClass("jobTitle")}
                      />
                      {fieldErrors.jobTitle && (
                        <p className="text-xs text-red-500 mt-1.5">{fieldErrors.jobTitle}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          Experience
                        </label>
                        <select
                          name="experienceYears"
                          value={formData.experienceYears}
                          onChange={handleChange}
                          className={inputClass("experienceYears") + " bg-white"}
                        >
                          <option value="">Select</option>
                          <option value="0-1">0-1 years</option>
                          <option value="1-3">1-3 years</option>
                          <option value="3-5">3-5 years</option>
                          <option value="5+">5+ years</option>
                        </select>
                        {fieldErrors.experienceYears && (
                          <p className="text-xs text-red-500 mt-1.5">{fieldErrors.experienceYears}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          Industry
                        </label>
                        <input
                          name="industry"
                          value={formData.industry}
                          onChange={handleChange}
                          placeholder="IT / Finance"
                          className={inputClass("industry")}
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* LinkedIn + GitHub */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      LinkedIn
                    </label>
                    <input
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      placeholder="linkedin.com/in/..."
                      className={inputClass("linkedin")}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                      GitHub
                    </label>
                    <input
                      name="github"
                      value={formData.github}
                      onChange={handleChange}
                      placeholder="github.com/username"
                      className={inputClass("github")}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 mt-3 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold transition flex items-center justify-center gap-2 shadow-sm"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;