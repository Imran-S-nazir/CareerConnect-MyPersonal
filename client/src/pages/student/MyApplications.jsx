import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getMyApplications, withdraw } from "../../services/applicationService";

export default function MyApplications({ embedded = false }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [filter, setFilter] = useState("All");

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getMyApplications();
      if (res.success) setApplications(res.applications || []);
      else setError(res.message || "Failed to load applications");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load applications.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleWithdraw = async (appId) => {
    if (!window.confirm("Withdraw this application?")) return;
    try {
      setActionLoading(true);
      setError("");
      const res = await withdraw(appId);
      if (res.success) {
        setApplications((prev) =>
          prev.map((a) =>
            a._id === appId ? { ...a, status: "Withdrawn", stage: "Withdrawn" } : a
          )
        );
      } else {
        setError(res.message || "Failed to withdraw");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to withdraw.");
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Hired":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Rejected":
        return "bg-red-50 text-red-700 border-red-200";
      case "Withdrawn":
        return "bg-slate-100 text-slate-500 border-slate-200";
      case "Offered":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";
      case "Interview":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Shortlisted":
        return "bg-amber-50 text-amber-800 border-amber-200";
      case "Under Review":
        return "bg-blue-50 text-blue-700 border-blue-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const filtered =
    filter === "All"
      ? applications
      : applications.filter((a) => a.status === filter);

  const statusTabs = [
    "All",
    "Applied",
    "Under Review",
    "Shortlisted",
    "Interview",
    "Offered",
    "Hired",
    "Rejected",
    "Withdrawn",
  ];

  const listBlock = (
    <>
      <div className="mb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            My Applications
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track internship & job applications
          </p>
        </div>
        {!embedded && (
          <Link to="/internships" className="text-xs font-bold text-[#1e3a8a]">
            Browse Internships →
          </Link>
        )}
      </div>

      <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
        {statusTabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setFilter(tab)}
            className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
              filter === tab
                ? "bg-[#1e3a8a] text-white shadow-sm"
                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center py-16">
          <div className="w-10 h-10 border-4 border-[#1e3a8a] border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-sm text-slate-500">Loading applications...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-14 rounded-2xl bg-white border border-slate-200">
          <div className="text-3xl mb-2">📄</div>
          <h3 className="text-base font-bold text-slate-800">
            {filter === "All" ? "No applications yet" : `No “${filter}” applications`}
          </h3>
          <p className="text-sm text-slate-500 mt-1">Apply to campus internships to track them here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => {
            const opportunity = app.internshipId || app.jobId;
            const cannotWithdraw = ["Hired", "Rejected", "Withdrawn"].includes(app.status);
            const internshipId = app.internshipId?._id || app.internshipId || null;

            return (
              <article
                key={app._id}
                className="bg-white border border-slate-200/80 rounded-2xl p-5 hover:border-[#1e3a8a]/25 hover:shadow-md transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadgeClass(
                          app.status
                        )}`}
                      >
                        {app.status}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                        {app.opportunityType || "Internship"}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">
                      {app.opportunityTitle || opportunity?.title || "Opportunity"}
                    </h3>
                    <p className="text-sm font-semibold text-slate-600 mt-0.5">
                      {app.companyName || opportunity?.companyName || "Company"}
                    </p>
                    <p className="text-xs text-slate-500 mt-2">
                      Applied{" "}
                      {new Date(app.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                      {opportunity?.stipend ? ` · ${opportunity.stipend}` : ""}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {internshipId && !embedded && (
                      <Link
                        to={`/internships/${internshipId}`}
                        className="h-9 px-3.5 inline-flex items-center rounded-xl border border-slate-200 text-xs font-bold text-slate-700"
                      >
                        View role
                      </Link>
                    )}
                    {!cannotWithdraw && (
                      <button
                        type="button"
                        onClick={() => handleWithdraw(app._id)}
                        disabled={actionLoading}
                        className="h-9 px-3.5 rounded-xl border border-red-200 text-xs font-bold text-red-600 hover:bg-red-50 disabled:opacity-50"
                      >
                        Withdraw
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );

  if (embedded) {
    return <div className="w-full">{listBlock}</div>;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link to="/home" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1e3a8a] text-white flex items-center justify-center text-xs font-bold">
              GU
            </div>
            <div className="leading-tight">
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                Geeta University
              </p>
              <p className="text-sm font-bold text-slate-900">CareerConnect</p>
            </div>
          </Link>
          <Link to="/internships" className="text-xs font-bold text-[#1e3a8a]">
            Browse Internships →
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8 rounded-3xl bg-gradient-to-br from-[#1e3a8a] via-[#1e40af] to-[#1e3a8a] text-white p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#f59e0b]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <p className="text-xs font-semibold text-blue-100 uppercase tracking-wider mb-2">
              Application tracker
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold">My Applications</h1>
            <p className="mt-2 text-sm text-blue-100">
              {applications.length} total application{applications.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        {listBlock}
      </main>
    </div>
  );
}