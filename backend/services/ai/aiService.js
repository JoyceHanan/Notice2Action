const {
  NOTICE_ANALYSIS_PROMPT,
  NOTICE_CHAT_PROMPT
} = require("../../utils/promptTemplate");

const extractJSON = (content) => {
  if (!content) {
    throw new Error("AI returned an empty response");
  }

  let cleaned = content.trim();

  if (cleaned.startsWith("```")) {
    cleaned = cleaned
      .replace(/^```json/i, "")
      .replace(/^```/i, "")
      .replace(/```$/i, "")
      .trim();
  }

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");

    if (start !== -1 && end !== -1) {
      return JSON.parse(
        cleaned.substring(start, end + 1)
      );
    }

    throw new Error(
      "AI returned invalid JSON"
    );
  }
};

const safeParseJSON = (input) => {
  if (typeof input === "string") {
    try {
      return JSON.parse(input);
    } catch (e) {
      return null;
    }
  }
  return input;
};

const validateAnalysis = (data) => {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid AI analysis object");
  }

  data.title =
    typeof data.title === "string" ? data.title : "Untitled Notice";

  data.summary =
    typeof data.summary === "string" ? data.summary : "";

  // 1. Important Points
  if (typeof data.importantPoints === "string") {
    data.importantPoints = safeParseJSON(data.importantPoints) || [data.importantPoints];
  }
  data.importantPoints = Array.isArray(data.importantPoints)
    ? data.importantPoints.map((p) => (typeof p === "string" ? p : JSON.stringify(p)))
    : [];

  // 2. Deadlines
  if (typeof data.deadlines === "string") {
    data.deadlines = safeParseJSON(data.deadlines) || [];
  }
  if (!Array.isArray(data.deadlines)) data.deadlines = [];
  data.deadlines = data.deadlines
    .map((d) => {
      if (typeof d === "string") d = safeParseJSON(d) || { title: d };
      if (!d || typeof d !== "object") return null;
      return {
        title: d.title || d.name || "Deadline",
        type: d.type || "other",
        date: d.date && !isNaN(Date.parse(d.date)) ? new Date(d.date) : undefined,
        priority: d.priority || "medium",
        sourceText: d.sourceText || ""
      };
    })
    .filter(Boolean);

  // Deduplicate deadlines by title
  const seenDeadlines = new Set();
  data.deadlines = data.deadlines
    .filter((d) => {
      const key = (d.title || "").toLowerCase().trim();
      if (!key || seenDeadlines.has(key)) return false;
      seenDeadlines.add(key);
      return true;
    })
    .slice(0, 5);

  // 3. Tasks
  if (typeof data.tasks === "string") {
    data.tasks = safeParseJSON(data.tasks) || [];
  }
  if (!Array.isArray(data.tasks)) data.tasks = [];
  data.tasks = data.tasks
    .map((t, idx) => {
      if (typeof t === "string") t = safeParseJSON(t) || { title: t };
      if (!t || typeof t !== "object") return null;

      let dependsOn = [];
      if (Array.isArray(t.dependsOn)) {
        dependsOn = t.dependsOn
          .map((dep) => {
            if (typeof dep === "number") return dep;
            if (typeof dep === "string" && !isNaN(Number(dep))) return Number(dep);
            return null;
          })
          .filter((x) => x !== null);
      }

      return {
        title: t.title || `Task ${idx + 1}`,
        description: t.description || "",
        priority: t.priority || "medium",
        status: t.status || "pending",
        dependsOn
      };
    })
    .filter(Boolean);

  // Deduplicate tasks by title
  const seenTasks = new Set();
  data.tasks = data.tasks
    .filter((t) => {
      const key = (t.title || "").toLowerCase().trim();
      if (!key || seenTasks.has(key)) return false;
      seenTasks.add(key);
      return true;
    })
    .slice(0, 5);

  // 4. Roadmap
  if (typeof data.roadmap === "string") {
    data.roadmap = safeParseJSON(data.roadmap) || [];
  }
  if (!Array.isArray(data.roadmap)) data.roadmap = [];
  data.roadmap = data.roadmap
    .map((r, idx) => {
      if (typeof r === "string") r = { title: r, step: idx + 1 };
      if (!r || typeof r !== "object") return null;
      return {
        step: r.step || idx + 1,
        title: r.title || `Step ${idx + 1}`,
        description: r.description || ""
      };
    })
    .filter(Boolean);

  // 5. Warnings
  if (typeof data.warnings === "string") {
    data.warnings = safeParseJSON(data.warnings) || [];
  }
  if (!Array.isArray(data.warnings)) data.warnings = [];
  data.warnings = data.warnings
    .map((w) => {
      if (typeof w === "string") w = safeParseJSON(w) || { message: w };
      if (!w || typeof w !== "object") return null;
      return {
        type: w.type || w.category || "warning",
        message: w.message || w.text || JSON.stringify(w),
        sourceText: w.sourceText || ""
      };
    })
    .filter(Boolean);

  // 6. Missing Information
  if (typeof data.missingInformation === "string") {
    data.missingInformation = safeParseJSON(data.missingInformation) || [data.missingInformation];
  }
  if (!Array.isArray(data.missingInformation)) data.missingInformation = [];

  // 7. Eligibility
  if (typeof data.eligibility === "string") {
    data.eligibility = safeParseJSON(data.eligibility) || { status: "unknown" };
  }
  if (!data.eligibility || typeof data.eligibility !== "object") {
    data.eligibility = {
      status: "unknown",
      reasons: [],
      requirements: {}
    };
  }

  // 8. Next Best Action
  if (typeof data.nextBestAction === "string") {
    data.nextBestAction = safeParseJSON(data.nextBestAction) || { title: data.nextBestAction };
  }
  if (!data.nextBestAction || typeof data.nextBestAction !== "object") {
    data.nextBestAction = {
      title: "",
      reason: "",
      priority: "medium"
    };
  }

  return data;
};

// Generic Lyzr API caller
const callLyzrApi = async (message, sessionId = null) => {
  const apiKey = process.env.AI_API_KEY;
  let baseUrl = process.env.AI_BASE_URL || "https://agent-prod.studio.lyzr.ai/v3/inference/chat/";
  if (!baseUrl.endsWith("/")) baseUrl += "/";
  const agentId = process.env.LYZR_AGENT_ID;

  if (!apiKey) {
    throw new Error("AI_API_KEY is not configured");
  }
  if (!agentId) {
    throw new Error("LYZR_AGENT_ID is not configured in .env.");
  }

  const payload = {
    user_id: "backend_system",
    agent_id: agentId,
    session_id: sessionId || `session_${Date.now()}`,
    message: message
  };

  const response = await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Lyzr API Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();

  if (!data.response) {
    throw new Error("Lyzr API returned an unexpected format or failed.");
  }

  return data.response;
};

const analyzeNotice = async ({
  noticeText,
  studentProfile
}) => {
  const studentData = {
    college: studentProfile?.college || null,
    degree: studentProfile?.degree || null,
    branch: studentProfile?.branch || null,
    year: studentProfile?.year || null,
    CGPA: studentProfile?.CGPA ?? null,
    backlogs: studentProfile?.backlogs ?? null,
    skills: studentProfile?.skills || [],
    graduationYear: studentProfile?.graduationYear || null
  };

  const userPrompt = `
SYSTEM PROMPT INSTRUCTIONS:
${NOTICE_ANALYSIS_PROMPT}

STUDENT PROFILE:
${JSON.stringify(studentData, null, 2)}

NOTICE:
${noticeText}

Please return the response strictly as valid JSON matching the format requested. Do not include markdown formatting or extra text outside the JSON.
`;

  const content = await callLyzrApi(userPrompt, `analyze_${Date.now()}`);
  const parsed = extractJSON(content);
  return validateAnalysis(parsed);
};

const askNotice = async ({
  noticeText,
  question,
  studentProfile,
  history = []
}) => {
  const studentData = {
    college: studentProfile?.college || null,
    degree: studentProfile?.degree || null,
    branch: studentProfile?.branch || null,
    year: studentProfile?.year || null,
    CGPA: studentProfile?.CGPA ?? null,
    backlogs: studentProfile?.backlogs ?? null,
    skills: studentProfile?.skills || []
  };

  let conversationHistory = "";
  if (history && history.length > 0) {
    conversationHistory = "\nCONVERSATION HISTORY:\n";
    history.slice(-10).forEach((msg) => {
      conversationHistory += `${msg.role.toUpperCase()}: ${msg.content}\n`;
    });
  }

  const userPrompt = `
SYSTEM INSTRUCTIONS:
${NOTICE_CHAT_PROMPT}

NOTICE:
${noticeText}

STUDENT PROFILE:
${JSON.stringify(studentData, null, 2)}
${conversationHistory}

USER QUESTION:
${question}
`;

  return await callLyzrApi(userPrompt, `ask_${Date.now()}`);
};

module.exports = {
  analyzeNotice,
  askNotice
};