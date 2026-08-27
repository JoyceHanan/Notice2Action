import React, { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../api/api";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  const [profile, setProfile] = useState({
    college: "",
    degree: "B.Tech",
    branch: "CSE",
    year: "4",
    cgpa: "8.5",
    backlogs: "0",
    skills: "React, Node.js, Python, Data Structures",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const res = await getProfile();
        const data = res.user || res.data || res;
        if (data) {
          setProfile((prev) => ({
            ...prev,
            college: data.college || prev.college,
            degree: data.degree || prev.degree,
            branch: data.branch || prev.branch,
            year: data.year ? String(data.year) : prev.year,
            cgpa: data.cgpa ? String(data.cgpa) : prev.cgpa,
            backlogs: data.backlogs !== undefined ? String(data.backlogs) : prev.backlogs,
            skills: Array.isArray(data.skills) ? data.skills.join(", ") : (data.skills || prev.skills),
          }));
        }
      } catch (err) {
        console.log("Profile API error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
    setSaved(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      setError("");
      await updateProfile(profile);
      setSaved(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const initials = (user?.name || user?.username || "S").charAt(0).toUpperCase();

  return (
    <main className="min-h-[calc(100vh-70px)] bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-2xl font-bold text-white shadow-md">
            {initials}
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Personalized Student Profile
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
              {user?.name || user?.username || "Student Profile"}
            </h1>
            <p className="mt-0.5 text-xs text-slate-500">
              {user?.email || "Student Account"}
            </p>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Academic Information */}
          <section>
            <div className="mb-6">
              <h2 className="text-lg font-extrabold text-slate-900">
                Academic & Qualification Details
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                These academic metrics are automatically checked by AI against notice eligibility criteria.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

              {/* College */}
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
                  College / Institute
                </label>
                <input
                  type="text"
                  name="college"
                  value={profile.college}
                  onChange={handleChange}
                  placeholder="e.g. National Institute of Technology"
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                />
              </div>

              {/* Degree */}
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Degree
                </label>
                <input
                  type="text"
                  name="degree"
                  value={profile.degree}
                  onChange={handleChange}
                  placeholder="B.Tech / B.E / B.Sc"
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                />
              </div>

              {/* Branch */}
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Branch / Specialization
                </label>
                <select
                  name="branch"
                  value={profile.branch}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                >
                  <option value="">Select Branch</option>
                  <option value="CSE">Computer Science (CSE)</option>
                  <option value="IT">Information Technology (IT)</option>
                  <option value="ECE">Electronics & Communication (ECE)</option>
                  <option value="EEE">Electrical (EEE)</option>
                  <option value="ME">Mechanical (ME)</option>
                  <option value="CIVIL">Civil (CE)</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              {/* Year */}
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Current Year
                </label>
                <select
                  name="year"
                  value={profile.year}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                >
                  <option value="">Select Year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>

              {/* CGPA */}
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
                  CGPA / Percentage
                </label>
                <input
                  type="number"
                  name="cgpa"
                  value={profile.cgpa}
                  onChange={handleChange}
                  min="0"
                  max="10"
                  step="0.01"
                  placeholder="8.50"
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                />
              </div>

              {/* Backlogs */}
              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Active Backlogs
                </label>
                <input
                  type="number"
                  name="backlogs"
                  value={profile.backlogs}
                  onChange={handleChange}
                  min="0"
                  placeholder="0"
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                />
              </div>
            </div>
          </section>

          {/* Skills */}
          <section className="mt-8 border-t border-slate-100 pt-6">
            <div className="mb-4">
              <h2 className="text-lg font-extrabold text-slate-900">
                Skills & Tech Stack
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Add comma-separated skills to match against job or contest requirements in notices.
              </p>
            </div>

            <textarea
              name="skills"
              value={profile.skills}
              onChange={handleChange}
              rows={3}
              placeholder="React, Python, Java, Machine Learning, SQL..."
              className="w-full resize-none rounded-xl border border-slate-300 p-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
            />
          </section>

          {/* Save Action */}
          <div className="mt-8 flex items-center gap-4 border-t border-slate-100 pt-6">
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-60"
            >
              {saving ? "Saving Changes..." : "Save Profile Details"}
            </button>

            {saved && (
              <span className="flex items-center gap-1.5 text-sm font-bold text-emerald-600">
                ✓ Profile saved successfully!
              </span>
            )}
          </div>

        </form>
      </div>
    </main>
  );
};

export default Profile;