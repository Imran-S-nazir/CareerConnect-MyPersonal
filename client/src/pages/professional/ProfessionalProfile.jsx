import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateUserProfile } from "../../redux/features/authSlice";
import { getDashboardPath } from "../../utils/dashboardRedirect";

const ProfessionalProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    currentCompany: "Microsoft",
    jobTitle: "Senior Software Engineer",
    experienceYears: "4-6 Years",
    industry: "Information Technology & Services",
    skills: "System Design, React, Node.js, Go, Kubernetes, Cloud Architecture",
    bio: "Senior engineer with expertise in distributed cloud architectures and scalable web platforms.",
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
      dispatch(
        updateUserProfile({
          fullName: formData.fullName,
          profileCompletion: 100,
          isProfileComplete: true,
        })
      );

      setSuccessMessage("Profile saved successfully! Redirecting to dashboard...");

      setTimeout(() => {
        const dest = getDashboardPath("professional");
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
            <h1 className="text-2xl font-bold text-slate-900">Professional Profile</h1>
            <p className="text-sm text-slate-500 mt-1">Manage your professional credentials and career preferences</p>
          </div>
          <Link
            to="/professional/dashboard"
            className="text-sm font-semibold text-violet-600 hover:underline"
          >
            ← Back to Dashboard
          </Link>
        </div>

        {successMessage && (
          <div className="mb-6 p-4 rounded-xl bg-violet-50 border border-violet-200 text-violet-700 text-sm font-medium">
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
              className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 text-sm outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Current Company</label>
              <input
                name="currentCompany"
                value={formData.currentCompany}
                onChange={handleChange}
                required
                className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 text-sm outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Current Job Title</label>
              <input
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                required
                className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 text-sm outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Years of Experience</label>
              <input
                name="experienceYears"
                value={formData.experienceYears}
                onChange={handleChange}
                required
                className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 text-sm outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Industry</label>
              <input
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                required
                className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 text-sm outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Core Competencies & Skills (comma separated)</label>
            <input
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="e.g. System Design, Microservices, Node.js"
              required
              className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 text-sm outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Professional Bio</label>
            <textarea
              name="bio"
              rows={3}
              value={formData.bio}
              onChange={handleChange}
              className="w-full p-4 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 text-sm outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <Link
              to="/professional/dashboard"
              className="px-6 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-sm font-semibold text-white transition shadow-sm"
            >
              {saving ? "Saving..." : "Save & Continue to Dashboard"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfessionalProfile;
