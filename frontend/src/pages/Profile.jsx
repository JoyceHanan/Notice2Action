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

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    /*
      Person 1 can connect this later to:

      PUT /api/profile

      through api.js.
    */

    console.log("Profile:", profile);

    setMessage("Profile saved successfully!");
  };

  return (
    <div className="profile-page">
      <div className="page-header">
        <h1>Student Profile</h1>

        <p>
          Keep your academic information updated so Notice2Action
          can check your eligibility accurately.
        </p>
      </div>

      <form
        className="profile-form"
        onSubmit={handleSubmit}
      >
        <div className="form-section">
          <h2>Academic Information</h2>

          <div className="form-grid">

            <div className="form-group">
              <label>College</label>

              <input
                type="text"
                name="college"
                value={profile.college}
                onChange={handleChange}
                placeholder="Enter your college"
              />
            </div>

            <div className="form-group">
              <label>Degree</label>

              <input
                type="text"
                name="degree"
                value={profile.degree}
                onChange={handleChange}
                placeholder="B.Tech"
              />
            </div>

            <div className="form-group">
              <label>Branch</label>

              <select
                name="branch"
                value={profile.branch}
                onChange={handleChange}
              >
                <option value="">Select Branch</option>
                <option value="CSE">
                  Computer Science
                </option>
                <option value="IT">
                  Information Technology
                </option>
                <option value="ECE">
                  Electronics
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

            <div className="form-group">
              <label>Year</label>

              <select
                name="year"
                value={profile.year}
                onChange={handleChange}
              >
                <option value="">Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>

            <div className="form-group">
              <label>CGPA</label>

              <input
                type="number"
                name="cgpa"
                value={profile.cgpa}
                onChange={handleChange}
                min="0"
                max="10"
                step="0.01"
                placeholder="8.50"
              />
            </div>

            <div className="form-group">
              <label>Backlogs</label>

              <input
                type="number"
                name="backlogs"
                value={profile.backlogs}
                onChange={handleChange}
                min="0"
                placeholder="0"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Skills</h2>

          <div className="form-group">
            <label>
              Skills
            </label>

            <textarea
              name="skills"
              value={profile.skills}
              onChange={handleChange}
              placeholder="React, Python, Java, Machine Learning..."
              rows="4"
            />

            <small>
              Separate multiple skills using commas.
            </small>
          </div>
        </div>

        {message && (
          <div className="success-message">
            {message}
          </div>
        )}

        <button
          type="submit"
          className="save-profile-btn"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default Profile;