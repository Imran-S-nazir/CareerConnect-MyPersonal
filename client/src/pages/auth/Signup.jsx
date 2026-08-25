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

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, success } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error || success) {
      dispatch(clearMessages());
    }
  };

  // Signup
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password validation
    if (formData.password !== formData.confirmPassword) {
      dispatch(signupFailure("Passwords do not match"));
      return;
    }

    dispatch(signupStart());

    try {
      const response = await api.post("/auth/register", formData);

      const { user } = response.data;

      dispatch(
        signupSuccess({
          user,
        })
      );

      // If backend automatically logs user in
      navigate("/student");
    } catch (err) {
      dispatch(
        signupFailure(
          err.response?.data?.message ||
            "Something went wrong. Please try again."
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
            Build your career.
            <br />
            Start today.
          </h2>

          <p className="text-blue-100 text-base xl:text-lg mt-6 max-w-xl leading-7">
            Create your CareerConnect account and unlock
            opportunities designed to help you grow,
            connect, and succeed.
          </p>

          {/* Features */}
          <div className="mt-9 space-y-5">

            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                ✓
              </div>

              <span className="text-blue-100">
                Discover jobs and internships matching your skills
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                ↗
              </div>

              <span className="text-blue-100">
                Connect with recruiters and leading companies
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                ✓
              </div>

              <span className="text-blue-100">
                Build your profile and showcase your credentials
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
              Create account
            </h2>

            <p className="text-gray-500 mt-2">
              Join us to kickstart your professional journey
            </p>

          </div>


          {/* ================= ERROR ================= */}
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


          {/* ================= SUCCESS ================= */}
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

            {/* Full Name + Username */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">

              {/* Full Name */}
              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                  <span className="text-red-500"> *</span>
                </label>

                <div className="relative">

                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    ♙
                  </span>

                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                    className="w-full border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 text-gray-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />

                </div>

              </div>


              {/* Username */}
              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                  <span className="text-red-500"> *</span>
                </label>

                <div className="relative">

                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                    ♙
                  </span>

                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="johndoe_99"
                    required
                    className="w-full border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 text-gray-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                  />

                </div>

              </div>

            </div>


            {/* Email */}
            <div className="mb-5">

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
                <span className="text-red-500"> *</span>
              </label>

              <div className="relative">

                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  ✉
                </span>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john.doe@example.com"
                  required
                  className="w-full border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 text-gray-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />

              </div>

            </div>


            {/* Phone */}
            <div className="mb-5">

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
                <span className="text-red-500"> *</span>
              </label>

              <div className="relative">

                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  ☎
                </span>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 019-2834"
                  required
                  className="w-full border border-gray-200 rounded-xl py-3.5 pl-11 pr-4 text-gray-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />

              </div>

            </div>


            {/* Password */}
            <div className="mb-5">

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
                <span className="text-red-500"> *</span>
              </label>

              <div className="relative">

                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  🔒
                </span>

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create strong password"
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


            {/* Confirm Password */}
            <div className="mb-6">

              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
                <span className="text-red-500"> *</span>
              </label>

              <div className="relative">

                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  🔒
                </span>

                <input
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Verify your password"
                  required
                  className="w-full border border-gray-200 rounded-xl py-3.5 pl-11 pr-12 text-gray-800 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (prev) => !prev
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? "🙈" : "👁"}
                </button>

              </div>

            </div>


            {/* Signup Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition"
            >

              {loading ? (
                <span className="flex items-center justify-center gap-2">

                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>

                  Creating account...

                </span>
              ) : (
                "Create Account"
              )}

            </button>

          </form>


          {/* ================= LOGIN ================= */}
          <p className="text-center text-sm text-gray-500 mt-7">

            Already have an account?{" "}

            <Link
              to="/login"
              className="text-blue-700 font-semibold hover:underline"
            >
              Log in
            </Link>

          </p>

        </div>
      </div>

    </div>
  );
};

export default Signup;