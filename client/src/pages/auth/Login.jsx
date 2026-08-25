import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import api from "../../api/api.jsx";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  clearMessages,
} from "../../redux/features/authSlice";

const MailIcon = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 7.5A2.5 2.5 0 015.5 5h13A2.5 2.5 0 0121 7.5v9a2.5 2.5 0 01-2.5 2.5h-13A2.5 2.5 0 013 16.5v-9z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 7l8 6 8-6" />
  </svg>
);

const LockIcon = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    <rect x="4" y="10" width="16" height="10" rx="2" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M8 10V7a4 4 0 018 0v3"
    />
  </svg>
);

const EyeIcon = ({ hidden = false }) => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
  >
    {hidden ? (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M10.6 10.6a2 2 0 002.8 2.8"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.9 4.2A10.8 10.8 0 0112 4c5 0 8.8 3.3 10 8a10.8 10.8 0 01-3 5.1"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.6 6.6A11 11 0 002 12c1.2 4.7 5 8 10 8a10.7 10.7 0 004.2-.8"
        />
      </>
    ) : (
      <>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z"
        />
        <circle cx="12" cy="12" r="2.5" />
      </>
    )}
  </svg>
);

const ArrowIcon = () => (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 12h14M13 6l6 6-6 6"
    />
  </svg>
);

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error || success) dispatch(clearMessages());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(loginStart());

    try {
      const loginValue = formData.emailOrUsername.trim();

      const loginData = {
        password: formData.password,
      };

      if (loginValue.includes("@")) {
        loginData.email = loginValue;
      } else {
        loginData.username = loginValue;
      }

      const response = await api.post("/auth/login", loginData);

      const { user, token } = response.data;

      dispatch(
        loginSuccess({
          user,
          token,
        }),
      );

      navigate("/home");
    } catch (err) {
      dispatch(
        loginFailure(
          err.response?.data?.message || "Invalid email/username or password",
        ),
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200/80">
        <div className="grid lg:grid-cols-2 min-h-[620px]">
          {/* Left Brand Panel */}
          <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white p-12 relative overflow-hidden">
            {/* Soft glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-16">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-600/30">
                  C
                </div>
                <div>
                  <h1 className="text-xl font-semibold tracking-tight">
                    CareerConnect
                  </h1>
                  <p className="text-xs text-slate-400">
                    Career & Opportunity Platform
                  </p>
                </div>
              </div>

              <h2 className="text-3xl xl:text-4xl font-semibold leading-tight tracking-tight mb-5">
                Connect with the <br />
                <span className="text-blue-400">right opportunities</span>
              </h2>
              <p className="text-slate-300 text-[15px] leading-relaxed max-w-sm">
                Discover internships, jobs, and build your professional profile
                — all in one place.
              </p>
            </div>

            <div className="relative z-10 space-y-4 text-sm text-slate-300">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                Find roles that match your skills
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                Build a strong professional profile
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                Take the next step in your career
              </div>
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="flex items-center justify-center p-6 sm:p-10 lg:p-12">
            <div className="w-full max-w-md">
              {/* Mobile Logo */}
              <div className="lg:hidden flex items-center justify-center gap-2.5 mb-10">
                <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                  C
                </div>
                <span className="text-xl font-semibold text-slate-900">
                  CareerConnect
                </span>
              </div>

              <div className="mb-8">
                <p className="text-sm font-medium text-blue-600 mb-1.5">
                  Welcome back
                </p>
                <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
                  Sign in to your account
                </h2>
                <p className="text-sm text-slate-500 mt-2">
                  Enter your credentials to continue
                </p>
              </div>

              {/* Messages */}
              {error && (
                <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email / Username */}
                <div>
                  <label
                    htmlFor="emailOrUsername"
                    className="block text-sm font-medium text-slate-700 mb-1.5"
                  >
                    Email or Username
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <MailIcon />
                    </div>
                    <input
                      id="emailOrUsername"
                      type="text"
                      name="emailOrUsername"
                      value={formData.emailOrUsername}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                      className="w-full h-11 rounded-lg border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-slate-700"
                    >
                      Password
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 transition"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <LockIcon />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                      className="w-full h-11 rounded-lg border border-slate-200 bg-white pl-11 pr-12 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                    >
                      <EyeIcon hidden={showPassword} />
                    </button>
                  </div>
                </div>

                {/* Remember me */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-4 h-4 rounded border-slate-300 accent-blue-600"
                  />
                  <label
                    htmlFor="remember"
                    className="text-sm text-slate-600 cursor-pointer"
                  >
                    Remember me
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-blue-400 disabled:cursor-not-allowed text-white text-sm font-semibold transition flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      Sign in
                      <ArrowIcon />
                    </>
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                <p className="text-sm text-slate-600">
                  Don’t have an account?{" "}
                  <Link
                    to="/signup"
                    className="font-semibold text-blue-600 hover:text-blue-700 transition"
                  >
                    Create account
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
