import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateUserProfile } from "../../redux/features/authSlice";
import { getDashboardPath } from "../../utils/dashboardRedirect";

const FresherProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    highestQualification: "B.Tech Computer Science",
    passoutYear: "2024",
    skills: "React, Node.js, Express, MongoDB, Tailwind CSS, Python",
    projectTitle: "E-Commerce Microservices Platform",
    projectDesc: "Built scalable web platform with authentication and payment integrations.",
    bio: "Passionate software engineering graduate looking for entry-level full stack roles.",
  });

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Simulate profile save or use API
      dispatch(
        updateUserProfile({
          fullName: formData.fullName,
          profileCompletion: 100,
          isProfileComplete: true,
        })
      );

      setSuccessMessage("Profile saved successfully! Redirecting to dashboard...");

      setTimeout(() => {
        const dest = getDashboardPath("fresher");
        navigate(dest, { replace: true });
      }, 700);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Fresher Profile</h1>
            <p className="text-sm text-slate-500 mt-1">Complete your background to attract recruiters</p>
          </div>
          <Link
            to="/fresher/dashboard"
            className="text-sm font-semibold text-emerald-600 hover:underline"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-medium">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSave} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Highest Qualification</label>
              <input
                name="highestQualification"
                value={formData.highestQualification}
                onChange={handleChange}
                required
                className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Passout Year</label>
              <input
                name="passoutYear"
                value={formData.passoutYear}
                onChange={handleChange}
                required
                className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Key Skills (comma separated)</label>
            <input
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g. React, Node.js, Python"
              required
              className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Featured Project Title</label>
            <input
              name="projectTitle"
              value={formData.projectTitle}
              onChange={handleChange}
              className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Project Description</label>
            <textarea
              name="projectDesc"
              rows={3}
              value={formData.projectDesc}
              onChange={handleChange}
              className="w-full p-4 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Bio / Summary</label>
            <textarea
              name="bio"
              rows={3}
              value={formData.bio}
              onChange={handleChange}
              className="w-full p-4 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-sm outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Link
              to="/fresher/dashboard"
              className="px-6 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-sm font-semibold text-white transition shadow-sm"
            >
              {saving ? "Saving..." : "Save & Continue to Dashboard"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FresherProfile;
