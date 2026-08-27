import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { uploadNotice } from "../api/api";

function UploadNotice() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const allowedExtensions = ["pdf", "docx", "txt"];
    const extension = file.name.split(".").pop().toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      setError("Please upload a PDF, DOCX, or TXT file.");
      setSelectedFile(null);
      return;
    }

    setError("");
    setSelectedFile(file);
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setError("Please select a notice file first.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await uploadNotice(selectedFile);

      const noticeId =
        data.notice?._id ||
        data.noticeId ||
        data._id;

      if (!noticeId) {
        throw new Error("Notice ID was not returned.");
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
    <div className="min-h-screen bg-slate-50 px-4 py-10">

      <div className="mx-auto max-w-3xl">

        {/* Heading */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-slate-800">
            Upload a Notice
          </h1>

          <p className="mt-3 text-slate-500">
            Upload your notice and let AI turn it into a personalized action plan.
          </p>
        </div>

        {/* Upload Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleUpload}>

            <div
              onClick={() => fileInputRef.current.click()}
              className="cursor-pointer rounded-xl border-2 border-dashed border-indigo-300 bg-indigo-50 p-12 text-center transition hover:border-indigo-500 hover:bg-indigo-100"
            >
              <div className="text-5xl">📄</div>

              <h2 className="mt-4 text-lg font-semibold text-slate-700">
                Click to upload your notice
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Supported formats: PDF, DOCX, TXT
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Selected File */}
            {selectedFile && (
              <div className="mt-6 flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-4">

                <div>
                  <p className="font-medium text-green-700">
                    ✓ File Selected
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    {selectedFile.name}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="text-sm font-medium text-red-500 hover:text-red-700"
                >
                  Remove
                </button>

              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-8 w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "AI is analyzing your notice..."
                : "Upload & Analyze"}
            </button>

          </form>

          {/* Loading Steps */}
          {loading && (
            <div className="mt-8 rounded-xl bg-slate-50 p-5">

              <p className="font-semibold text-slate-700">
                🤖 AI Analysis in Progress
              </p>

              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p>✓ Reading notice content</p>
                <p>✓ Extracting important information</p>
                <p>✓ Detecting deadlines</p>
                <p>✓ Checking eligibility</p>
                <p>✓ Creating your action plan</p>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default UploadNotice;