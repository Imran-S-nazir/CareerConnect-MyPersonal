import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/features/authSlice";
import { logoutUser } from "../../services/authService";

const ProfessionalDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      console.error(e);
    }
    dispatch(logout());
    navigate("/login");
  };

  const proName = user?.fullName || "Professional";
  const completion = user?.profileCompletion || 85;

  const currentCompany = "Microsoft / Cloud Systems";
  const currentRole = "Senior Software Engineer";
  const experienceYears = "4+ Years";
  const industry = "Software & Cloud Architecture";

  const skills = [
    "System Design",
    "Node.js & Go",
    "React / Next.js",
    "Kubernetes & Docker",
    "PostgreSQL",
    "AWS & Microservices",
    "CI/CD Pipelines",
  ];

  const executiveJobs = [
    {
      id: "ej-1",
      title: "Staff Software Engineer - Distributed Systems",
      company: "Stripe",
      location: "Bangalore (Remote / Hybrid)",
      salary: "₹45 - 65 LPA + Equity",
      experienceRequired: "4-7 Years",
    },
    {
      id: "ej-2",
      title: "Engineering Lead (Full Stack)",
      company: "Razorpay",
      location: "Bangalore",
      salary: "₹50 - 75 LPA",
      experienceRequired: "5+ Years",
    },
    {
      id: "ej-3",
      title: "Senior Backend Architect",
      company: "Atlassian",
      location: "Remote (India)",
      salary: "₹55 - 80 LPA",
      experienceRequired: "4+ Years",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center font-bold text-lg text-white shadow-md shadow-violet-600/30">
              C
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900">CareerConnect</span>
              <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">
                Professional
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/professional/profile"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-violet-600 bg-violet-50 hover:bg-violet-100 rounded-xl transition"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit Profile
            </Link>

            <button
              onClick={handleLogout}
              className="text-sm font-medium text-slate-500 hover:text-slate-800 transition"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Banner */}
        <section className="bg-gradient-to-r from-violet-700 via-purple-700 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-violet-200 text-xs font-medium mb-3 backdrop-blur-sm">
              💼 Professional Hub
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Welcome, {proName}!
            </h1>
            <p className="text-violet-100 text-sm sm:text-base mt-2 leading-relaxed">
              Explore high-growth leadership roles, confidential career transitions, and high-impact compensation packages.
            </p>

            {/* Profile Bar */}
            <div className="mt-6 p-4 rounded-2xl bg-white/10 backdrop-blur-md max-w-xl">
              <div className="flex justify-between items-center text-xs font-semibold mb-2">
                <span>Executive Profile Strength</span>
                <span className="text-violet-200">{completion}% Complete</span>
              </div>
              <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-violet-300 h-full rounded-full transition-all duration-500"
                  style={{ width: `${completion}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Columns */}
          <div className="lg:col-span-2 space-y-8">
            {/* Current Position Snapshot */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-slate-900">Current Position</h2>
                <Link to="/professional/profile" className="text-xs font-semibold text-violet-600 hover:underline">
                  Update Role
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-xs text-slate-400 font-medium">Role & Title</div>
                  <div className="font-semibold text-slate-900 mt-1">{currentRole}</div>
                  <div className="text-xs text-violet-600 font-medium mt-1">{currentCompany}</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-xs text-slate-400 font-medium">Experience & Industry</div>
                  <div className="font-semibold text-slate-900 mt-1">{experienceYears}</div>
                  <div className="text-xs text-slate-500 mt-1">{industry}</div>
                </div>
              </div>
            </section>

            {/* High-Growth Job Recommendations */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Curated Executive Roles</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Matched to your seniority and technical expertise</p>
                </div>
              </div>

              <div className="space-y-4">
                {executiveJobs.map((job) => (
                  <div
                    key={job.id}
                    className="p-5 rounded-xl border border-slate-100 hover:border-violet-300 hover:shadow-md transition bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <h3 className="font-semibold text-slate-900 text-base">{job.title}</h3>
                      <p className="text-sm text-slate-600">{job.company} • {job.location}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs font-medium text-slate-500">
                        <span className="text-violet-700 font-bold">{job.salary}</span>
                        <span>•</span>
                        <span>{job.experienceRequired}</span>
                      </div>
                    </div>
                    <button className="px-5 py-2.5 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-700 rounded-xl transition self-start sm:self-center shadow-sm">
                      Express Interest
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Core Competencies */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 mb-3">Core Competencies</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((sk, idx) => (
                  <span key={idx} className="px-3 py-1 text-xs font-semibold bg-violet-50 text-violet-700 rounded-lg border border-violet-100">
                    {sk}
                  </span>
                ))}
              </div>
            </section>

            {/* Career Transition Preferences */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 mb-3">Career Growth Mode</h2>
              <div className="p-4 rounded-xl bg-violet-50/60 border border-violet-100">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-slate-900">Open to select opportunities</span>
                </div>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Your profile is confidentially visible to verified hiring managers and venture-backed startups.
                </p>
                <Link
                  to="/professional/profile"
                  className="mt-3 inline-block text-xs font-semibold text-violet-600 hover:underline"
                >
                  Adjust Preferences →
                </Link>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfessionalDashboard;
