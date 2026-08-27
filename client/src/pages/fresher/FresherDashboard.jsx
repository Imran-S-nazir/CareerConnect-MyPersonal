import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/features/authSlice";
import { logoutUser } from "../../services/authService";

const FresherDashboard = () => {
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

  const fresherName = user?.fullName || "Graduate";
  const completion = user?.profileCompletion || 75;

  const skills = ["JavaScript", "React.js", "Node.js", "Express", "MongoDB", "Tailwind CSS", "Git", "SQL"];

  const projects = [
    {
      id: "p-1",
      title: "E-Commerce Microservices Platform",
      description: "Full-stack scalable web app built with React, Node.js, and Redis caching.",
      technologies: ["React", "Node.js", "MongoDB", "Redux"],
      githubUrl: "https://github.com",
    },
    {
      id: "p-2",
      title: "Real-time Chat & Collaboration App",
      description: "Socket.IO powered collaborative board and direct messaging app.",
      technologies: ["React", "Socket.io", "Tailwind CSS"],
      githubUrl: "https://github.com",
    },
  ];

  const internshipHistory = [
    {
      id: "exp-1",
      role: "Frontend Intern",
      company: "Apex Innovations",
      period: "Jan 2024 - Jun 2024 (6 Mos)",
      highlights: "Built customer-facing React dashboards and reduced initial load time by 30%.",
    },
  ];

  const recommendedJobs = [
    {
      id: "j-1",
      title: "Junior Full Stack Developer",
      company: "CodeCraft Solutions",
      location: "Bangalore (Hybrid)",
      salary: "₹6.5 - 9 LPA",
      type: "Full-Time",
    },
    {
      id: "j-2",
      title: "Graduate Software Engineer (Trainee)",
      company: "Tata Elxsi / Global Tech",
      location: "Pune",
      salary: "₹5.5 - 7.5 LPA",
      type: "Full-Time",
    },
  ];

  const recommendedInternships = [
    {
      id: "int-1",
      title: "Full Stack Engineer (Intern to Hire)",
      company: "GrowthStack Labs",
      stipend: "₹30,000 / mo",
      location: "Remote",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center font-bold text-lg text-white shadow-md shadow-emerald-600/30">
              C
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-900">CareerConnect</span>
              <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                Fresher
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/fresher/profile"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition"
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
        <section className="bg-gradient-to-r from-emerald-600 via-teal-700 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-medium mb-3 backdrop-blur-sm">
              🚀 Fresher Workspace
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Welcome back, {fresherName}!
            </h1>
            <p className="text-emerald-100 text-sm sm:text-base mt-2 leading-relaxed">
              Launch your career. Discover entry-level roles, track applications, and highlight your project portfolio.
            </p>

            {/* Profile Completion */}
            <div className="mt-6 p-4 rounded-2xl bg-white/10 backdrop-blur-md max-w-xl">
              <div className="flex justify-between items-center text-xs font-semibold mb-2">
                <span>Profile Strength</span>
                <span className="text-emerald-200">{completion}% Complete</span>
              </div>
              <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-300 h-full rounded-full transition-all duration-500"
                  style={{ width: `${completion}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left 2 Cols */}
          <div className="lg:col-span-2 space-y-8">
            {/* Projects Highlights */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Featured Projects</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Showcase your technical capabilities to hiring recruiters</p>
                </div>
                <Link to="/fresher/profile" className="text-xs font-semibold text-emerald-600 hover:underline">
                  + Add Project
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {projects.map((p) => (
                  <div key={p.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900 text-sm">{p.title}</h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{p.description}</p>
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {p.technologies.map((t, idx) => (
                          <span key={idx} className="px-2 py-0.5 bg-white text-slate-700 text-[10px] font-medium rounded border border-slate-200">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                    <a
                      href={p.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 text-xs font-semibold text-emerald-600 hover:underline inline-flex items-center gap-1"
                    >
                      View Source ↗
                    </a>
                  </div>
                ))}
              </div>
            </section>

            {/* Internship / Training History */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-slate-900">Internship & Experience</h2>
                <Link to="/fresher/profile" className="text-xs font-semibold text-emerald-600 hover:underline">
                  Edit
                </Link>
              </div>

              <div className="space-y-3">
                {internshipHistory.map((item) => (
                  <div key={item.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-slate-900 text-sm">{item.role}</h3>
                        <p className="text-xs font-medium text-emerald-700">{item.company}</p>
                      </div>
                      <span className="text-[11px] text-slate-500">{item.period}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-2">{item.highlights}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Recommended Jobs */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Entry-Level Opportunities</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Verified fresh graduate job listings</p>
                </div>
              </div>

              <div className="space-y-4">
                {recommendedJobs.map((j) => (
                  <div
                    key={j.id}
                    className="p-4 rounded-xl border border-slate-100 hover:border-emerald-300 hover:shadow-md transition bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <h3 className="font-semibold text-slate-900 text-base">{j.title}</h3>
                      <p className="text-sm text-slate-600">{j.company} • {j.location}</p>
                      <p className="text-xs font-semibold text-emerald-600 mt-1">{j.salary}</p>
                    </div>
                    <button className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition self-start sm:self-center">
                      Apply Now
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Skills */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 mb-3">Key Skills</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((sk, idx) => (
                  <span key={idx} className="px-2.5 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100">
                    {sk}
                  </span>
                ))}
              </div>
            </section>

            {/* Resume Section */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 mb-3">Fresher Resume</h2>
              <div className="p-4 rounded-xl bg-slate-50 border border-dashed border-slate-300 text-center">
                <svg className="w-8 h-8 mx-auto text-emerald-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div className="text-xs font-semibold text-slate-800">Standard Resume Attached</div>
                <Link
                  to="/fresher/profile"
                  className="mt-3 inline-block text-xs font-semibold text-emerald-600 hover:underline"
                >
                  Update Resume →
                </Link>
              </div>
            </section>

            {/* Pre-Placement Internships */}
            <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 mb-3">Intern-To-Hire Programs</h2>
              <div className="space-y-3">
                {recommendedInternships.map((int) => (
                  <div key={int.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <h3 className="text-xs font-bold text-slate-900">{int.title}</h3>
                    <p className="text-[11px] text-slate-600 mt-0.5">{int.company}</p>
                    <div className="flex justify-between items-center text-[11px] text-emerald-600 font-semibold mt-2">
                      <span>{int.stipend}</span>
                      <span>{int.location}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FresherDashboard;
