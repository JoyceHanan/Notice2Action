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

const validateAnalysis = (data) => {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid AI analysis");
  }

  data.title =
    typeof data.title === "string"
      ? data.title
      : "Untitled Notice";

  data.summary =
    typeof data.summary === "string"
      ? data.summary
      : "";

  data.importantPoints =
    Array.isArray(data.importantPoints)
      ? data.importantPoints
      : [];

  data.deadlines =
    Array.isArray(data.deadlines)
      ? data.deadlines
      : [];

  data.tasks =
    Array.isArray(data.tasks)
      ? data.tasks
      : [];

  data.roadmap =
    Array.isArray(data.roadmap)
      ? data.roadmap
      : [];

  data.warnings =
    Array.isArray(data.warnings)
      ? data.warnings
      : [];

  data.missingInformation =
    Array.isArray(data.missingInformation)
      ? data.missingInformation
      : [];

  if (!data.eligibility) {
    data.eligibility = {
      status: "unknown",
      reasons: [],
      requirements: {}
    };
  }

  if (
    ![
      "eligible",
      "partially_eligible",
      "not_eligible",
      "unknown"
    ].includes(data.eligibility.status)
  ) {
    data.eligibility.status = "unknown";
  }

  if (!data.nextBestAction) {
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
  // Ensure trailing slash
  if (!baseUrl.endsWith("/")) baseUrl += "/";
  const agentId = process.env.LYZR_AGENT_ID;

  if (!apiKey) {
    throw new Error("AI_API_KEY is not configured");
  }
  if (!agentId) {
    throw new Error("LYZR_AGENT_ID is not configured in .env. You must add it for Lyzr to work.");
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
    graduationYear:
      studentProfile?.graduationYear || null
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
    history.slice(-10).forEach(msg => {
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