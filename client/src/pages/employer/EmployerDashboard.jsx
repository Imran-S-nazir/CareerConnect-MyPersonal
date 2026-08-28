import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getEmployerDashboard } from "../../services/employerService";
import { logoutUser } from "../../services/authService";
import { logout } from "../../redux/features/authSlice";

const EmployerDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await getEmployerDashboard();
        if (res?.success) {
          setDashboardData(res);
        }
      } catch (err) {
        console.error("Failed to load employer dashboard", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (e) {
      // ignore
    }
    dispatch(logout());
    navigate("/login?type=employer", { replace: true });
  };

  const profile = dashboardData?.profile || {};
  const stats = dashboardData?.stats || {
    activeJobs: 4,
    internships: 8,
    totalOpportunities: 12,
    applications: 148,
    shortlisted: 26,
    interviews: 8,
    profileViews: 1240,
  };

  const completion = dashboardData?.profileCompletion || profile.profileCompletion || 85;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#f59e0b] border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-slate-600">
          Loading Employer Workspace...
        </p>
      </div>
    );
  }

  const navItems = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "profile", label: "Company Profile", icon: "🏢", isLink: true, linkTo: "/employer/profile" },
    { id: "post-job", label: "Post Opportunity", icon: "➕" },
    { id: "manage-jobs", label: "Manage Listings", icon: "💼" },
    { id: "applications", label: "Applications", icon: "📑", badge: stats.applications },
    { id: "candidates", label: "Candidates", icon: "👥" },
    { id: "shortlisted", label: "Shortlisted", icon: "⭐", badge: stats.shortlisted },
    { id: "interviews", label: "Interviews", icon: "📅", badge: stats.interviews },
    { id: "analytics", label: "Analytics", icon: "📈" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      {/* Top Navbar */}
      <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#92400e] to-[#b45309] text-white flex items-center justify-center font-bold text-xs shadow-sm">
            GU
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 tracking-tight leading-none">
              GEETA UNIVERSITY
            </h1>
            <p className="text-[10.5px] text-[#b45309] font-bold tracking-wide">
              CareerConnect · Employer Hub
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to={`/companies/${profile._id || profile.userId || "preview"}`}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 hover:border-amber-300 text-xs font-semibold text-slate-700 hover:text-[#b45309] bg-slate-50 hover:bg-amber-50 transition"
          >
            <span>👁️</span> Public Profile View
          </Link>

          <Link
            to="/employer/profile"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-white text-xs font-bold shadow-sm transition"
          >
            <span>✏️</span> Edit Profile
          </Link>

          <div className="h-6 w-px bg-slate-200" />

          {/* User Account / Logout */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center font-bold text-xs text-[#92400e] overflow-hidden">
              {profile.logo ? (
                <img src={profile.logo} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                profile.companyName?.[0] || "E"
              )}
            </div>
            <button
              onClick={handleLogout}
              className="text-xs text-slate-500 hover:text-red-600 font-semibold p-1"
              title="Sign Out"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto p-4 sm:p-6 gap-6">
        {/* Left Sidebar Navigation */}
        <aside className="hidden md:flex flex-col w-60 flex-shrink-0 space-y-1 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs h-fit sticky top-22">
          {navItems.map((item) => {
            const isCurrent = activeTab === item.id;
            if (item.isLink) {
              return (
                <Link
                  key={item.id}
                  to={item.linkTo}
                  className="px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition flex items-center justify-between group"
                >
                  <span className="flex items-center gap-2.5">
                    <span>{item.icon}</span>
                    {item.label}
                  </span>
                  <span className="text-[10px] text-amber-600 group-hover:translate-x-0.5 transition font-bold">
                    Edit →
                  </span>
                </Link>
              );
            }

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition flex items-center justify-between ${
                  isCurrent
                    ? "bg-amber-50 text-[#92400e] font-bold border border-amber-200/80 shadow-xs"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <span>{item.icon}</span>
                  {item.label}
                </span>
                {item.badge !== undefined && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isCurrent
                        ? "bg-[#92400e] text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Dashboard Main Content Area */}
        <main className="flex-1 space-y-6">
          {/* Company Overview Header Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#92400e] via-[#b45309] to-[#78350f] text-white shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-72 h-72 bg-[#fbbf24]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white p-1.5 shadow-md flex items-center justify-center overflow-hidden flex-shrink-0">
                  {profile.logo ? (
                    <img
                      src={profile.logo}
                      alt={profile.companyName}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-[#92400e]">
                      {profile.companyName?.[0] || "GU"}
                    </span>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-2xl font-bold text-white tracking-tight">
                      {profile.companyName || "Your Company Name"}
                    </h2>
                    <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-bold text-[#fde68a] border border-white/20">
                      {profile.isPublished ? "✓ Verified & Published" : "📝 Draft Profile"}
                    </span>
                  </div>
                  <p className="text-xs text-amber-100/90 mt-1">
                    {profile.industry || "Information Technology"} ·{" "}
                    {profile.headquarters?.city || "Gurugram, India"} ·{" "}
                    {profile.companySize || "11–50"} Employees
                  </p>
                  {profile.tagline && (
                    <p className="text-xs text-amber-100/80 italic mt-2">
                      "{profile.tagline}"
                    </p>
                  )}
                </div>
              </div>

              {/* Profile Completion Bar */}
              <div className="bg-black/25 border border-white/20 rounded-2xl p-4 backdrop-blur-md min-w-[240px]">
                <div className="flex items-center justify-between text-xs font-semibold text-amber-100 mb-1.5">
                  <span>Profile Strength</span>
                  <span className="text-[#fde68a] font-bold text-sm">
                    {completion}%
                  </span>
                </div>
                <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-gradient-to-r from-[#fde68a] to-[#fbbf24] rounded-full transition-all duration-500"
                    style={{ width: `${completion}%` }}
                  />
                </div>
                <Link
                  to="/employer/profile"
                  className="text-[11px] font-bold text-white hover:text-[#fde68a] flex items-center justify-between"
                >
                  <span>{completion < 100 ? "Complete missing sections" : "Review profile"}</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
              <span className="text-xl">💼</span>
              <p className="text-2xl font-bold text-slate-900">{stats.activeJobs + stats.internships}</p>
              <p className="text-[11.5px] font-semibold text-slate-500">Active Roles</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
              <span className="text-xl">📑</span>
              <p className="text-2xl font-bold text-[#b45309]">{stats.applications}</p>
              <p className="text-[11.5px] font-semibold text-slate-500">Applications</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
              <span className="text-xl">⭐</span>
              <p className="text-2xl font-bold text-emerald-600">{stats.shortlisted}</p>
              <p className="text-[11.5px] font-semibold text-slate-500">Shortlisted</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
              <span className="text-xl">📅</span>
              <p className="text-2xl font-bold text-blue-600">{stats.interviews}</p>
              <p className="text-[11.5px] font-semibold text-slate-500">Interviews</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
              <span className="text-xl">🎓</span>
              <p className="text-2xl font-bold text-purple-600">{stats.internships}</p>
              <p className="text-[11.5px] font-semibold text-slate-500">Internships</p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
              <span className="text-xl">👁️</span>
              <p className="text-2xl font-bold text-slate-800">{stats.profileViews}</p>
              <p className="text-[11.5px] font-semibold text-slate-500">Profile Views</p>
            </div>
          </div>

          {/* Active Job Opportunities & Recent Applicants */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Active Job Postings */}
            <div className="lg:col-span-2 p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Active Listings & Open Roles
                  </h3>
                  <p className="text-xs text-slate-400">
                    Live positions visible to Geeta University talent
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => alert("Opportunity Creator wizard modal")}
                  className="px-3 py-1.5 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-white text-xs font-bold shadow-xs transition"
                >
                  + Post Opportunity
                </button>
              </div>

              <div className="space-y-2.5">
                {(dashboardData?.activeListings || []).map((job) => (
                  <div
                    key={job.id}
                    className="p-4 rounded-2xl border border-slate-100 hover:border-amber-200 bg-slate-50/50 hover:bg-amber-50/30 transition flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-slate-900">
                          {job.title}
                        </h4>
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-[#92400e] text-[10.5px] font-bold">
                          {job.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        📍 {job.location} · Posted {job.postedDate}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-900">
                          {job.applicantsCount}
                        </span>
                        <p className="text-[10px] text-slate-400">Applicants</p>
                      </div>
                      <button
                        type="button"
                        className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:border-amber-400"
                      >
                        Manage
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions & Hiring Status */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900">
                Employer Action Center
              </h3>

              <div className="space-y-2">
                <Link
                  to="/employer/profile"
                  className="w-full p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-left flex items-center gap-3 group transition hover:bg-amber-100/60"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#f59e0b] text-white flex items-center justify-center font-bold text-sm">
                    🏢
                  </div>
                  <div className="flex-1">
                    <h5 className="text-xs font-bold text-[#92400e]">
                      Update Company Profile
                    </h5>
                    <p className="text-[10.5px] text-amber-700">
                      Manage culture, perks, benefits & team
                    </p>
                  </div>
                  <span className="text-amber-800 font-bold text-xs group-hover:translate-x-0.5 transition">
                    →
                  </span>
                </Link>

                <div
                  onClick={() => alert("Candidate Talent Search Filter")}
                  className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-left flex items-center gap-3 cursor-pointer group transition hover:bg-slate-100"
                >
                  <div className="w-9 h-9 rounded-xl bg-slate-800 text-white flex items-center justify-center font-bold text-sm">
                    🔍
                  </div>
                  <div className="flex-1">
                    <h5 className="text-xs font-bold text-slate-900">
                      Search Geeta University Talent
                    </h5>
                    <p className="text-[10.5px] text-slate-500">
                      Filter verified students by CGPA & skills
                    </p>
                  </div>
                  <span className="text-slate-600 font-bold text-xs group-hover:translate-x-0.5 transition">
                    →
                  </span>
                </div>

                <div
                  onClick={() => alert("Schedule Campus Interview Drive")}
                  className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-left flex items-center gap-3 cursor-pointer group transition hover:bg-slate-100"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                    📅
                  </div>
                  <div className="flex-1">
                    <h5 className="text-xs font-bold text-slate-900">
                      Schedule Campus Drive
                    </h5>
                    <p className="text-[10.5px] text-slate-500">
                      Coordinate with Geeta Placement Cell
                    </p>
                  </div>
                  <span className="text-slate-600 font-bold text-xs group-hover:translate-x-0.5 transition">
                    →
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Applications Table Card */}
          <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Recent Applications Received
                </h3>
                <p className="text-xs text-slate-400">
                  Geeta University students & graduates who recently applied
                </p>
              </div>
              <button
                type="button"
                className="text-xs font-bold text-amber-600 hover:text-amber-800"
              >
                View All Applications ({stats.applications}) →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
                    <th className="pb-3">Candidate</th>
                    <th className="pb-3">Role Applied</th>
                    <th className="pb-3">Match Score</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {(dashboardData?.recentApplications || []).map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3">
                        <div className="font-bold text-slate-900">{app.candidateName}</div>
                        <div className="text-[11px] text-slate-400">{app.degree}</div>
                      </td>
                      <td className="py-3">
                        <span className="font-semibold text-slate-800">{app.roleApplied}</span>
                        <span className="block text-[10.5px] text-slate-400">{app.type}</span>
                      </td>
                      <td className="py-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                          ⚡ {app.matchScore}% Match
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 font-semibold border border-amber-200 text-[11px]">
                          {app.status}
                        </span>
                      </td>
                      <td className="py-3 text-slate-400 text-[11px]">{app.appliedDate}</td>
                      <td className="py-3 text-right space-x-2">
                        <button
                          type="button"
                          className="px-2.5 py-1 rounded-lg bg-slate-900 text-white font-semibold text-[11px] hover:bg-black"
                        >
                          Review
                        </button>
                        <button
                          type="button"
                          className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:border-amber-400 text-[11px]"
                        >
                          Shortlist
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default EmployerDashboard;
