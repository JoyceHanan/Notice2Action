import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://notice2action-60hw.onrender.com/api",
});

// Automatically attach JWT token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// =========================AUTH APIs=========================

export const registerUser = async (userData) => {
  const response = await API.post("/auth/register", userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await API.post("/auth/login", userData);
  return response.data;
};

// =========================NOTICE APIs=========================

// Upload a notice file
export const uploadNotice = async (file) => {
  const formData = new FormData();

  formData.append("notice", file);

  const response = await API.post("/notices/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

// Paste notice text directly (converts to a text file payload for compatibility)
export const pasteNotice = async (text, title = "Pasted Notice") => {
  const blob = new Blob([text], { type: "text/plain" });
  const file = new File([blob], `${title.replace(/[^a-z0-9]/gi, "_").toLowerCase() || "notice"}.txt`, {
    type: "text/plain",
  });
  return await uploadNotice(file);
};

// Get all notices
export const getNotices = async () => {
  const response = await API.get("/notices");
  return response.data;
};

// Get one notice
export const getNoticeById = async (noticeId) => {
  const response = await API.get(`/notices/${noticeId}`);
  return response.data;
};

// Ask AI about a notice
export const askNoticeQuestion = async (noticeId, question) => {
  const response = await API.post(`/notices/${noticeId}/chat`, {
    question,
  });

  return response.data;
};

// =========================PROFILE APIs=========================

export const getProfile = async () => {
  const response = await API.get("/profile");
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await API.put("/profile", profileData);
  return response.data;
};

// =========================TASK APIs=========================

export const updateTask = async (taskId, taskData) => {
  const response = await API.patch(`/tasks/${taskId}`, taskData);
  return response.data;
};

// =========================DASHBOARD APIs=========================

export const getDashboard = async () => {
  const response = await API.get("/dashboard");
  return response.data;
};

// =========================REMINDER APIs=========================

export const getReminders = async () => {
  const response = await API.get("/reminders");
  return response.data;
};

export default API;