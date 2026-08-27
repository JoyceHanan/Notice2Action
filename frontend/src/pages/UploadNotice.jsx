import { useRef, useState } from "react";
import { useNavigate } from "react-router";
import { uploadNotice, pasteNotice } from "../api/api";

function UploadNotice() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [activeTab, setActiveTab] = useState("upload"); // 'upload' | 'paste'
  const [selectedFile, setSelectedFile] = useState(null);
  const [pastedText, setPastedText] = useState("");
  const [noticeTitle, setNoticeTitle] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (file) => {
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

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();

    if (activeTab === "upload" && !selectedFile) {
      setError("Please select a notice file first.");
      return;
    }

    if (activeTab === "paste" && !pastedText.trim()) {
      setError("Please paste the notice text first.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      let data;
      if (activeTab === "upload") {
        data = await uploadNotice(selectedFile);
      } else {
        data = await pasteNotice(pastedText, noticeTitle || "Pasted Notice");
      }

      const noticeId =
        data.data?._id ||
        data.data?.id ||
        data.notice?._id ||
        data.noticeId ||
        data._id;

      if (!noticeId) {
        throw new Error("Notice ID was not returned from the server.");
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
    <div className="min-h-[calc(100vh-70px)] bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">

        {/* Heading */}
        <div className="mb-8 text-center">
          <span className="inline-block rounded-full bg-indigo-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-indigo-600">
            AI Notice Processor
          </span>
          <h1 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
            Upload or Paste Your Notice
          </h1>
          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Upload a document or paste raw notice text to get instant summaries, eligibility criteria, deadlines, and a checklist.
          </p>
        </div>

        {/* Main Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

          {/* Mode Tabs */}
          <div className="mb-6 flex rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => { setActiveTab("upload"); setError(""); }}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition ${
                activeTab === "upload"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload Document
            </button>

            <button
              type="button"
              onClick={() => { setActiveTab("paste"); setError(""); }}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-semibold transition ${
                activeTab === "paste"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Paste Notice Text
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              <svg className="mt-0.5 h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>{error}</div>
            </div>
          )}

          <form onSubmit={handleUploadSubmit}>

            {/* TAB 1: FILE UPLOAD */}
            {activeTab === "upload" && (
              <div>
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`group relative flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition-all ${
                    isDragging
                      ? "border-indigo-500 bg-indigo-50/80 scale-[0.99]"
                      : "border-slate-300 bg-slate-50/50 hover:border-indigo-400 hover:bg-indigo-50/40"
                  }`}
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-indigo-600 transition group-hover:scale-110">
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>

                  <h3 className="mt-4 text-base font-bold text-slate-800">
                    Drag and drop your file here
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    or click to browse from your device
                  </p>
                  <div className="mt-4 flex gap-2">
                    <span className="rounded-md bg-slate-200/70 px-2 py-1 text-[11px] font-semibold text-slate-600">PDF</span>
                    <span className="rounded-md bg-slate-200/70 px-2 py-1 text-[11px] font-semibold text-slate-600">DOCX</span>
                    <span className="rounded-md bg-slate-200/70 px-2 py-1 text-[11px] font-semibold text-slate-600">TXT</span>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.txt"
                    onChange={(e) => handleFileChange(e.target.files[0])}
                    className="hidden"
                  />
                </div>

                {/* File preview box */}
                {selectedFile && (
                  <div className="mt-4 flex items-center justify-between rounded-xl border border-indigo-200 bg-indigo-50/60 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white uppercase">
                        {selectedFile.name.split(".").pop()}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-900">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {(selectedFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="rounded-lg p-1 text-slate-400 hover:bg-indigo-100 hover:text-red-600"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: PASTE TEXT */}
            {activeTab === "paste" && (
              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Notice Title (Optional)
                  </label>
                  <input
                    type="text"
                    value={noticeTitle}
                    onChange={(e) => setNoticeTitle(e.target.value)}
                    placeholder="e.g. Semester Exam Fee Notice"
                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                    Notice Content
                  </label>
                  <textarea
                    rows={8}
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    placeholder="Paste the full text of the notice here..."
                    className="w-full rounded-xl border border-slate-300 p-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-6 w-full rounded-xl bg-indigo-600 py-3.5 text-sm font-bold text-white shadow-md transition hover:bg-indigo-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Analyzing with AI...
                </span>
              ) : (
                "Upload & Analyze Notice →"
              )}
            </button>
          </form>

          {/* AI Progress Steps */}
          {loading && (
            <div className="mt-8 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50/80 to-purple-50/80 p-5 animate-fade-in">
              <div className="flex items-center gap-2 text-sm font-bold text-indigo-900">
                <span className="relative flex h-3 w-3">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex h-3 w-3 rounded-full bg-indigo-600"></span>
                </span>
                AI Processing Pipeline
              </div>

              <div className="mt-4 space-y-2.5 text-xs font-medium text-slate-600">
                <div className="flex items-center gap-2 text-indigo-700 font-semibold">
                  <svg className="h-4 w-4 animate-spin text-indigo-600" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/></svg>
                  Parsing notice content and structure
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-300"></span>
                  Generating concise summary & key takeaways
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-300"></span>
                  Extracting deadlines & eligibility criteria
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-slate-300"></span>
                  Building personalized action checklist
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default UploadNotice;