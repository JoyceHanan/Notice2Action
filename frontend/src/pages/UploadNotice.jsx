import { useState } from "react";
import { useNavigate } from "react-router";
import { uploadNotice } from "../api/api";

function UploadNotice() {
  const navigate = useNavigate();

  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    setError("");

    if (!file) {
      return;
    }

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a PDF, DOCX, or TXT file.");
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setError("Please select a notice file.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await uploadNotice(selectedFile);

      // Adjust according to backend response
      const noticeId =
        data.notice?._id ||
        data.noticeId ||
        data._id;

      if (!noticeId) {
        throw new Error("Notice ID was not returned by the server.");
      }

      navigate(`/notices/${noticeId}`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to upload and analyze the notice."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page">
      <div className="upload-container">
        <h1>Upload Notice</h1>

        <p>
          Upload your college or placement notice and let
          Notice2Action convert it into an action plan.
        </p>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleUpload}>
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={handleFileChange}
          />

          {selectedFile && (
            <div className="selected-file">
              <p>
                Selected: <strong>{selectedFile.name}</strong>
              </p>
            </div>
          )}

          <button type="submit" disabled={loading}>
            {loading
              ? "Analyzing Notice..."
              : "Upload & Analyze"}
          </button>
        </form>

        {loading && (
          <div className="analysis-loading">
            <p>🤖 AI is analyzing your notice...</p>

            <ul>
              <li>Extracting important information</li>
              <li>Finding deadlines</li>
              <li>Checking eligibility requirements</li>
              <li>Generating your action plan</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadNotice;