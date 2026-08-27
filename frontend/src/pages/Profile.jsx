import React, { useState } from "react";

const Profile = () => {
  const [profile, setProfile] = useState({
    college: "",
    degree: "",
    branch: "",
    year: "",
    cgpa: "",
    backlogs: "",
    skills: "",
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));

    setSaved(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    /*
      Person 1 will later connect this to:

      PUT /api/profile
    */

    console.log(profile);

    setSaved(true);
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 md:ml-60 md:px-8 lg:px-10">

      {/* Header */}
      <div className="mb-8">
        <p className="mb-2 text-sm font-semibold text-indigo-600">
          PERSONAL INFORMATION
        </p>

        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          Student Profile
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
          Keep your academic information updated so
          Notice2Action can check your eligibility
          accurately.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="max-w-4xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8"
      >

        {/* Academic */}
        <section>
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">
              Academic Information
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              These details are used by the eligibility checker.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

            {/* College */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                College
              </label>

              <input
                type="text"
                name="college"
                value={profile.college}
                onChange={handleChange}
                placeholder="Enter your college"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
              />
            </div>

            {/* Degree */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Degree
              </label>

              <input
                type="text"
                name="degree"
                value={profile.degree}
                onChange={handleChange}
                placeholder="B.Tech"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
              />
            </div>

            {/* Branch */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Branch
              </label>

              <select
                name="branch"
                value={profile.branch}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
              >
                <option value="">
                  Select Branch
                </option>
                <option value="CSE">
                  Computer Science
                </option>
                <option value="IT">
                  Information Technology
                </option>
                <option value="ECE">
                  Electronics & Communication
                </option>
                <option value="EEE">
                  Electrical
                </option>
                <option value="ME">
                  Mechanical
                </option>
                <option value="CIVIL">
                  Civil
                </option>
                <option value="OTHER">
                  Other
                </option>
              </select>
            </div>

            {/* Year */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Year
              </label>

              <select
                name="year"
                value={profile.year}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
              >
                <option value="">
                  Select Year
                </option>
                <option value="1">
                  1st Year
                </option>
                <option value="2">
                  2nd Year
                </option>
                <option value="3">
                  3rd Year
                </option>
                <option value="4">
                  4th Year
                </option>
              </select>
            </div>

            {/* CGPA */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                CGPA
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
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
              />
            </div>

            {/* Backlogs */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Backlogs
              </label>

              <input
                type="number"
                name="backlogs"
                value={profile.backlogs}
                onChange={handleChange}
                min="0"
                placeholder="0"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
              />
            </div>
          </div>
        </section>

        {/* Skills */}
        <section className="mt-10 border-t border-slate-100 pt-8">

          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">
              Skills
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Add skills that can be compared against notice requirements.
            </p>
          </div>

          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Your Skills
          </label>

          <textarea
            name="skills"
            value={profile.skills}
            onChange={handleChange}
            rows="4"
            placeholder="React, Python, Java, Machine Learning..."
            className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
          />

          <p className="mt-2 text-xs text-slate-400">
            Separate multiple skills using commas.
          </p>
        </section>

        {/* Save */}
        <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center">

          <button
            type="submit"
            className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 active:scale-[0.98]"
          >
            Save Profile
          </button>

          {saved && (
            <p className="rounded-lg bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700">
              ✓ Profile saved successfully
            </p>
          )}
        </div>

      </form>
    </main>
  );
};

export default Profile;