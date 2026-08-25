import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      {/* ================= NAVBAR ================= */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-lg">
                C
              </div>
              <span className="text-xl font-semibold tracking-tight">CareerConnect</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
              <a href="#features" className="hover:text-blue-600 transition">Features</a>
              <a href="#opportunities" className="hover:text-blue-600 transition">Opportunities</a>
              <a href="#how-it-works" className="hover:text-blue-600 transition">How it works</a>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="hidden sm:inline-flex text-sm font-medium text-slate-700 hover:text-blue-600 transition"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center h-10 px-5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition shadow-sm"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-indigo-400/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-sm text-blue-700 font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              Career & Opportunity Platform
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-slate-900 leading-[1.15]">
              Find the right{" "}
              <span className="text-blue-600">opportunities</span>
              <br />
              for your career
            </h1>

            <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Discover internships, jobs, and projects. Build your profile, apply with ease, and take the next step in your professional journey.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/signup"
                className="w-full sm:w-auto h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                Create free account
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <a
                href="#opportunities"
                className="w-full sm:w-auto h-12 px-8 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-slate-700 font-semibold transition flex items-center justify-center"
              >
                Browse opportunities
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="border-y border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "500+", label: "Opportunities" },
              { value: "2,000+", label: "Students" },
              { value: "150+", label: "Companies" },
              { value: "1,200+", label: "Applications" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-semibold text-slate-900">{stat.value}</p>
                <p className="text-sm text-slate-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
              Everything you need to grow
            </h2>
            <p className="mt-4 text-slate-600">
              Whether you're a student, fresher, or working professional — CareerConnect helps you find the right path.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Discover Opportunities",
                desc: "Browse internships, jobs, apprenticeships, and projects that match your skills and interests.",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                ),
              },
              {
                title: "Build Your Profile",
                desc: "Showcase education, skills, projects, and experience in a professional profile that stands out.",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                ),
              },
              {
                title: "Easy Applications",
                desc: "Apply to opportunities with a few clicks. Track your applications in one place.",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                ),
              },
              {
                title: "Interview Tracking",
                desc: "Stay updated on interview schedules and manage your selection process smoothly.",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ),
              },
              {
                title: "For Employers",
                desc: "Post opportunities, review applications, and find the right talent for your organization.",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                ),
              },
              {
                title: "Resources & Guidance",
                desc: "Access career resources, templates, and tips to improve your applications and interviews.",
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                ),
              },
            ].map((item) => (
              <div
                key={item.title}
                className="p-6 rounded-2xl border border-slate-200 bg-white hover:border-blue-200 hover:shadow-md transition"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5">
                  {item.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= OPPORTUNITY CATEGORIES ================= */}
      <section id="opportunities" className="py-20 lg:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
              Explore opportunity types
            </h2>
            <p className="mt-4 text-slate-600">
              Find what fits your current stage — whether you're studying, just starting out, or looking to grow.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { title: "Internships", desc: "Gain real-world experience while studying", color: "bg-blue-600" },
              { title: "Jobs", desc: "Full-time and part-time roles for your career", color: "bg-indigo-600" },
              { title: "Apprenticeships", desc: "Learn while you earn with structured training", color: "bg-violet-600" },
              { title: "Projects", desc: "Build skills through real industry projects", color: "bg-sky-600" },
            ].map((cat) => (
              <div
                key={cat.title}
                className="group p-6 rounded-2xl bg-white border border-slate-200 hover:shadow-lg transition cursor-pointer"
              >
                <div className={`w-10 h-10 rounded-lg ${cat.color} mb-5`} />
                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition">
                  {cat.title}
                </h3>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">{cat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section id="how-it-works" className="py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-slate-900">
              How CareerConnect works
            </h2>
            <p className="mt-4 text-slate-600">
              Simple steps to start your journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {[
              {
                step: "01",
                title: "Create your account",
                desc: "Sign up and choose whether you are a student, fresher, or working professional.",
              },
              {
                step: "02",
                title: "Build your profile",
                desc: "Add education, skills, projects, and experience to make your profile complete.",
              },
              {
                step: "03",
                title: "Apply & grow",
                desc: "Discover opportunities, apply easily, and track your applications and interviews.",
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="text-5xl font-bold text-blue-100 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-20 lg:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 px-8 py-14 sm:px-12 sm:py-16 text-center">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl" />

            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-semibold text-white tracking-tight">
                Ready to take the next step?
              </h2>
              <p className="mt-4 text-slate-300 max-w-xl mx-auto">
                Join thousands of students and professionals already using CareerConnect to find opportunities.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/signup"
                  className="w-full sm:w-auto h-12 px-8 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition shadow-lg"
                >
                  Create free account
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto h-12 px-8 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold transition border border-white/20"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                C
              </div>
              <span className="font-semibold text-slate-900">CareerConnect</span>
            </div>

            <p className="text-sm text-slate-500 text-center">
              Built for students and professionals · Career & Opportunity Platform
            </p>

            <div className="flex items-center gap-6 text-sm text-slate-500">
              <Link to="/login" className="hover:text-blue-600 transition">Sign in</Link>
              <Link to="/signup" className="hover:text-blue-600 transition">Sign up</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;