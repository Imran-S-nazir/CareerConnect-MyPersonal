import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import api from "../../api/api";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  clearMessages,
} from "../../redux/features/authSlice";

const MailIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5A2.5 2.5 0 015.5 5h13A2.5 2.5 0 0121 7.5v9a2.5 2.5 0 01-2.5 2.5h-13A2.5 2.5 0 013 16.5v-9z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 7l8 6 8-6" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="4" y="10" width="16" height="10" rx="2" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 10V7a4 4 0 018 0v3" />
  </svg>
);

const EyeIcon = ({ hidden = false }) => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    {hidden ? (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.6 10.6a2 2 0 002.8 2.8" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.9 4.2A10.8 10.8 0 0112 4c5 0 8.8 3.3 10 8a10.8 10.8 0 01-3 5.1" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.6 6.6A11 11 0 002 12c1.2 4.7 5 8 10 8a10.7 10.7 0 004.2-.8" />
      </>
    ) : (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6-10-6-10-6z" />
        <circle cx="12" cy="12" r="2.5" />
      </>
    )}
  </svg>
);

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [loginType, setLoginType] = useState("student"); // student | employer
  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) dispatch(clearMessages());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());

    try {
      const response = await api.post("/auth/login", {
        ...formData,
        role: loginType, // student or employer
      });

      const { user, token } = response.data;
      dispatch(loginSuccess({ user, token }));

      // Navigate based on role
      if (user.role === "employer") {
        navigate("/employer/dashboard");
      } else {
        navigate("/student/dashboard");
      }
    } catch (err) {
      dispatch(
        loginFailure(
          err.response?.data?.message || "Invalid email/username or password"
        )
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200/80">
        <div className="grid lg:grid-cols-2 min-h-[620px]">

          {/* Left Panel */}
          <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 text-white p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative z-10">
              <Link to="/" className="flex items-center gap-3 mb-16">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-lg shadow-lg shadow-blue-600/30">
                  C
                </div>
                <div>
                  <h1 className="text-xl font-semibold tracking-tight">CareerConnect</h1>
                  <p className="text-xs text-slate-400">Career & Opportunity Platform</p>
                </div>
              </Link>

              <h2 className="text-3xl xl:text-4xl font-semibold leading-tight tracking-tight mb-5">
                Welcome back to <br />
                <span className="text-blue-400">your career journey</span>
              </h2>
              <p className="text-slate-300 text-[15px] leading-relaxed max-w-sm">
                Sign in as a student or employer to continue.
              </p>
            </div>

            <div className="relative z-10 space-y-4 text-sm text-slate-300">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                Students: Find internships & jobs
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                Employers: Post opportunities & hire talent
              </div>
            </div>
          </div>

          {/* Right Form */}
          <div className="flex items-center justify-center p-6 sm:p-10 lg:p-12">
            <div className="w-full max-w-md">
              <div className="lg:hidden flex items-center justify-center gap-2.5 mb-8">
                <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-lg">C</div>
                <span className="text-xl font-semibold text-slate-900">CareerConnect</span>
              </div>

              <div className="mb-7">
                <p className="text-sm font-medium text-blue-600 mb-1.5">Welcome back</p>
                <h2 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight">
                  Sign in to your account
                </h2>
              </div>

              {/* Student | Employer Toggle */}
              <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
                <button
                  type="button"
                  onClick={() => setLoginType("student")}
                  className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition ${
                    loginType === "student"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setLoginType("employer")}
                  className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition ${
                    loginType === "employer"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Employer
                </button>
              </div>

              {error && (
                <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    Email or Username
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <MailIcon />
                    </div>
                    <input
                      type="text"
                      name="emailOrUsername"
                      value={formData.emailOrUsername}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                      className="w-full h-11 rounded-lg border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-sm font-medium text-slate-700">Password</label>
                    <Link to="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                      <LockIcon />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                      className="w-full h-11 rounded-lg border border-slate-200 bg-white pl-11 pr-12 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((p) => !p)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <EyeIcon hidden={showPassword} />
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold transition flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    `Sign in as ${loginType === "student" ? "Student" : "Employer"}`
                  )}
                </button>
              </form>

              <div className="mt-8 pt-6 border-t border-slate-100 text-center space-y-3">
                <p className="text-sm text-slate-600">
                  Don’t have an account?
                </p>
                <div className="flex gap-3 justify-center">
                  <Link
                    to="/register/student"
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Student Register
                  </Link>
                  <span className="text-slate-300">|</span>
                  <Link
                    to="/register/employer"
                    className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                  >
                    Employer Register
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;