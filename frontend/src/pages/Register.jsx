import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { registerUser } from "../api/api";

const getPasswordStrength = (pw) => {
  if (!pw) return { level: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { level: 1, label: "Weak", color: "bg-red-500" };
  if (score === 2) return { level: 2, label: "Fair", color: "bg-amber-500" };
  if (score === 3) return { level: 3, label: "Good", color: "bg-yellow-400" };
  return { level: 4, label: "Strong", color: "bg-emerald-500" };
};

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const strength = getPasswordStrength(formData.password);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      setLoading(true);
      await registerUser({ name: formData.name, email: formData.email, password: formData.password });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const EyeIcon = ({ show, onToggle }) => (
    <button type="button" onClick={onToggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
      {show ? (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7s4-7 9-7a10.05 10.05 0 011.875.175M15 12a3 3 0 11-6 0 3 3 0 016 0zM3 3l18 18" />
        </svg>
      ) : (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )}
    </button>
  );

  return (
    <div className="flex min-h-screen">

      {/* ── LEFT PANEL ── */}
      <div className="hidden w-[48%] flex-col justify-between bg-gradient-to-br from-purple-600 via-indigo-700 to-indigo-800 p-12 lg:flex">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-lg font-bold text-white">N</div>
          <span className="text-xl font-bold text-white">Notice2Action</span>
        </div>

        <div>
          <h1 className="text-4xl font-extrabold leading-tight text-white">
            Get started
            <br />
            <span className="text-purple-200">in seconds</span>
          </h1>
          <p className="mt-5 text-lg leading-7 text-indigo-200">
            Create your free account and never miss another deadline or eligibility opportunity.
          </p>

          <div className="mt-8 space-y-4">
            {["Free forever — no credit card", "AI analysis on every notice", "Instant deadline notifications"].map((t) => (
              <div key={t} className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-xs text-white">✓</span>
                <span className="text-sm text-indigo-100">{t}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-indigo-300">"Your action plan starts here."</p>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex flex-1 flex-col items-center justify-center bg-slate-50 px-6 py-10 sm:px-10">

        {/* Mobile brand */}
        <div className="mb-6 flex items-center gap-2 lg:hidden">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-sm font-bold text-white">N</div>
          <span className="text-lg font-bold text-slate-900">Notice2Action</span>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-7">
            <h2 className="text-2xl font-bold text-slate-900">Create your account</h2>
            <p className="mt-1.5 text-sm text-slate-500">Start turning notices into clear action plans.</p>
          </div>

          {error && (
            <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700">
              <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">Full Name</label>
              <input
                type="text" name="name" value={formData.name} onChange={handleChange}
                placeholder="Your name" required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">Email address</label>
              <input
                type="email" name="email" value={formData.email} onChange={handleChange}
                placeholder="you@example.com" required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
              />
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"} name="password" value={formData.password} onChange={handleChange}
                  placeholder="Create a strong password" required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-11 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                />
                <EyeIcon show={showPw} onToggle={() => setShowPw((p) => !p)} />
              </div>

              {/* Strength meter */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-300 ${i <= strength.level ? strength.color : "bg-slate-200"}`} />
                    ))}
                  </div>
                  <p className={`mt-1 text-xs font-medium ${strength.level <= 1 ? "text-red-500" : strength.level === 2 ? "text-amber-500" : strength.level === 3 ? "text-yellow-500" : "text-emerald-600"}`}>
                    {strength.label} password
                  </p>
                </div>
              )}
            </div>

            {/* Confirm password */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-slate-700">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                  placeholder="Re-enter your password" required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-11 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                />
                <EyeIcon show={showConfirm} onToggle={() => setShowConfirm((p) => !p)} />
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="mt-2 w-full rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Creating account...
                </span>
              ) : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-700">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;