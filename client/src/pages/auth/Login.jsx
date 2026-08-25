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

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux state
  const { loading, error, success } = useSelector(
    (state) => state.auth
  );

  // Only form-related state stays local
  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove old error/success when user starts typing
    if (error || success) {
      dispatch(clearMessages());
    }
  };

  // Login
  const handleSubmit = async (e) => {
    e.preventDefault();

    dispatch(loginStart());

    try {
      const response = await api.post(
        "/auth/login",
        formData
      );

      const { user, token } = response.data;

      // Save user and token in Redux
      dispatch(
        loginSuccess({
          user,
          token,
        })
      );

      // Redirect after successful login
      navigate("/home");
    } catch (err) {
      dispatch(
        loginFailure(
          err.response?.data?.message ||
            "Invalid email/username or password"
        )
      );
    }
  };

  return (
    <div className="min-h-screen flex bg-white">

      {/* ================= LEFT SECTION ================= */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-700 to-blue-900 text-white p-10 xl:p-12 flex-col">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center text-xl">
            💼
          </div>

          <h1 className="text-2xl font-bold">
            CareerConnect
          </h1>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-center">

          <h2 className="text-4xl xl:text-5xl font-bold leading-tight">
            Your next opportunity
            <br />
            starts here.
          </h2>

          <p className="text-blue-100 text-base xl:text-lg mt-6 max-w-xl leading-7">
            Discover thousands of curated job and internship
            opportunities, connect with top-tier recruiters, and
            take the next step in your professional journey.
          </p>

          {/* Features */}
          <div className="mt-9 space-y-5">

            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                ✓
              </div>

              <span className="text-blue-100">
                Vetted roles from high-growth startups & top enterprises
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                ↗
              </div>

              <span className="text-blue-100">
                Personalized recommendations matching your skills
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                ✓
              </div>

              <span className="text-blue-100">
                Verified credentials that catch recruiters' attention
              </span>
            </div>

          </div>
        </div>
      </div>


      {/* ================= RIGHT SECTION ================= */}
      <div className="w-full lg:w-1/2 min-h-screen flex items-center justify-center bg-gray-50 px-5 py-8">

        <div className="w-full max-w-lg bg-white rounded-3xl p-7 sm:p-9 xl:p-10 shadow-sm">

          {/* Header */}
          <div className="mb-7">
            <h2 className="text-3xl font-bold text-gray-900">
              Welcome back
            </h2>

            <p className="text-gray-500 mt-2">
              Log in to manage your career opportunities
            </p>
          </div>


          {/* ================= ERROR MESSAGE ================= */}
          {error && (
            <div className="mb-5 flex items-center gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3">
              <span className="text-red-500 text-lg">
                ⚠
              </span>

              <p className="text-sm text-red-600">
                {error}
              </p>
            </div>
          )}


          {/* ================= SUCCESS MESSAGE ================= */}
          {success && (
            <div className="mb-5 flex items-center gap-3 rounded-xl bg-green-50 border border-green-200 px-4 py-3">
              <span className="text-green-600 text-lg">
                ✓
              </span>

              <p className="text-sm text-green-700">
                {success}
              </p>
            </div>
          )}


          {/* ================= FORM ================= */}
          <form onSubmit={handleSubmit}>

            {/* Email / Username */}
            <div className="mb-5">

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email or Username
                <span className="text-red-500"> *</span>
              </label>

              <div className="relative">

                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  ✉
                </span>

                <input
                  type="text"
                  name="emailOrUsername"
                  value={formData.emailOrUsername}
                  onChange={handleChange}
                  placeholder="Enter your email or username"
                  required
                  className="w-full border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 text-gray-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />

              </div>
            </div>


            {/* Password */}
            <div className="mb-4">

              <div className="flex justify-between items-center mb-2">

                <label className="text-sm font-medium text-gray-700">
                  Password
                  <span className="text-red-500"> *</span>
                </label>

                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-blue-700 hover:text-blue-800"
                >
                  Forgot password?
                </Link>

              </div>


              <div className="relative">

                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  🔒
                </span>

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full border border-gray-200 rounded-xl py-3.5 pl-11 pr-12 text-gray-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? "🙈" : "👁"}
                </button>

              </div>
            </div>


            {/* Remember Me */}
            <div className="flex items-center gap-2 mb-6">

              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 accent-blue-600"
              />

              <label
                htmlFor="remember"
                className="text-sm text-gray-600"
              >
                Remember me
              </label>

            </div>


            {/* ================= LOGIN BUTTON ================= */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Logging in...
                </span>
              ) : (
                "Log In"
              )}
            </button>

          </form>


          {/* ================= OR ================= */}
          <div className="flex items-center gap-4 my-7">

            <div className="h-px bg-gray-200 flex-1"></div>

            <span className="text-xs font-medium text-gray-400 whitespace-nowrap">
              OR CONTINUE WITH
            </span>

            <div className="h-px bg-gray-200 flex-1"></div>

          </div>


          {/* ================= SOCIAL LOGIN ================= */}
          <div className="grid grid-cols-2 gap-3">

            <button
              type="button"
              className="border border-gray-200 rounded-xl py-3 flex items-center justify-center gap-2 hover:bg-gray-50 transition"
            >
              <span className="font-bold text-red-500">
                G
              </span>

              <span className="text-sm font-medium text-gray-700">
                Continue with Google
              </span>
            </button>


            <button
              type="button"
              className="border border-gray-200 rounded-xl py-3 flex items-center justify-center gap-2 hover:bg-gray-50 transition"
            >
              <span className="font-bold text-blue-700">
                in
              </span>

              <span className="text-sm font-medium text-gray-700">
                Continue with LinkedIn
              </span>
            </button>

          </div>


          {/* ================= SIGNUP ================= */}
          <p className="text-center text-sm text-gray-500 mt-7">

            Don't have an account?{" "}

            <Link
              to="/signup"
              className="text-blue-700 font-semibold hover:underline"
            >
              Create one
            </Link>

          </p>

        </div>
      </div>

    </div>
  );
};

export default Login;