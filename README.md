# Notice2Action — Project Documentation

**Repository:** https://github.com/JoyceHanan/Notice2Action

---

## 1. Project Objective / Problem Statement

Academic and institutional notices (circulars, scholarship announcements, exam notifications, admission bulletins, placement notices, etc.) are usually published as dense PDF or DOCX documents. Students routinely struggle to:

- Read through long, jargon-heavy notices to find what actually matters to them.
- Determine whether they are even **eligible** for the opportunity or requirement described.
- Identify **deadlines** buried inside paragraphs of text.
- Figure out the **sequence of actions** needed to comply with or benefit from the notice.
- Remember to act before the deadline passes.

As a result, students miss deadlines, misunderstand eligibility criteria, or fail to complete the required steps in time — leading to lost opportunities (scholarships, internships, exam registrations) or non-compliance with institutional requirements.

**Problem Statement:** There is no simple, centralized tool that converts a raw academic notice into a clear, actionable, and trackable plan tailored to an individual student.

---

## 2. Proposed Solution

**Notice2Action** is a full-stack web application that turns static notices into structured, actionable guidance. Students upload a notice (PDF or DOCX), and the system:

1. **Parses** the document to extract its raw text.
2. Sends the extracted content to an **AI engine** that analyzes the notice and returns a structured summary — key points, deadlines, eligibility conditions, and suggested tasks.
3. **Matches** the notice's eligibility criteria against the student's stored academic profile to automatically flag whether they qualify.
4. Generates a **checklist** and a **step-by-step roadmap** describing exactly what the student needs to do and by when.
5. Tracks all extracted **deadlines** centrally and triggers **reminders** as they approach.
6. Provides an **AI chat interface** so the student can ask follow-up questions about a specific notice in natural language.
7. Surfaces everything through a **dashboard** that gives an at-a-glance view of all notices, pending tasks, and upcoming deadlines.

In short, the platform automates the "read, understand, decide, plan, remember" workflow that a student would otherwise have to do manually for every notice.

---

## 3. Key Features

| Feature | Description |
|---|---|
| **Notice Upload & Parsing** | Upload notices in PDF or DOCX format; the backend automatically extracts and parses their text content. |
| **AI-Powered Analysis** | An AI agent analyzes the parsed notice and returns a structured summary, important points, deadlines, and task suggestions. |
| **AI Chat** | Students can chat with an AI assistant to ask specific questions about a notice's content. |
| **Eligibility Check** | Automatically compares notice requirements against the student's profile to determine eligibility. |
| **Deadline Tracking** | Centralized tracking of all deadlines extracted from uploaded notices. |
| **Smart Checklists** | Auto-generated, editable checklists of actions required to comply with or benefit from a notice. |
| **Roadmap Generator** | Produces a step-by-step roadmap guiding the student through the required process. |
| **Reminders** | Configurable reminders that notify students of approaching deadlines. |
| **Dashboard** | Consolidated overview of notices, deadlines, and pending tasks. |
| **Student Profile** | Stores academic details used to power eligibility matching. |
| **Authentication** | Secure registration and login using JSON Web Tokens (JWT). |

---

## 4. Technologies Used

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19.x | UI framework |
| Vite | 5.x | Build tool & development server |
| Tailwind CSS | 4.1.x | Styling |
| React Router | 7.x | Client-side routing |
| Axios | 1.x | HTTP client for API communication |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | 18+ | Runtime environment |
| Express.js | 4.x | Web application framework |
| MongoDB + Mongoose | 8.x | Database & object data modeling |
| JWT (jsonwebtoken) | 9.x | Authentication |
| Multer | 1.x | Handling file uploads |
| pdf-parse + mammoth | latest | PDF and DOCX text extraction |
| bcryptjs | 2.x | Password hashing |
| Helmet + express-rate-limit | latest | HTTP security & rate limiting |
| Cloudinary SDK | — | Cloud storage for uploaded files (optional/configurable) |

### AI Layer
| Technology | Purpose |
|---|---|
| Lyzr AI Agent API | External inference endpoint used for notice analysis and the AI chat feature, called via a configurable `AI_BASE_URL` / `LYZR_AGENT_ID` / `AI_API_KEY`. |

---

## 5. Implementation Details

### 5.1 Architecture
Notice2Action follows a classic **client–server (MERN-style) architecture**:

- **Frontend (React + Vite SPA):** Located in `frontend/`, organized into `api/` (Axios calls), `components/`, `context/` (e.g., authentication context), and `pages/` (Dashboard, Login, Register, UploadNotice, NoticeDetails, Profile, Reminders).
- **Backend (Express REST API):** Located in `backend/`, organized into `config/` (database & Cloudinary configuration), `controllers/` (business logic per resource), `middlewares/` (auth guards, error handling), `models/` (Mongoose schemas), `routes/` (REST endpoint definitions), `services/` (AI integration, document parsing, notifications), and `utils/` (helper functions, prompt templates).
- **Database:** MongoDB, accessed via Mongoose, with schemas for `User`, `Notice`, `Eligibility`, `Reminder`, `Roadmap`, `Chat`, `Deadline`, `StudentProfile`, and `Task`.

### 5.2 Notice Ingestion Pipeline
1. A user uploads a file via `POST /api/notices/upload` (handled by Multer).
2. The **document service** (`services/document/pdfParser.js` for PDFs, `docParser.js` for DOCX, with `ocrService.js` available for scanned/image-based documents) extracts raw text from the file.
3. The extracted text is passed to the **AI service** (`services/ai/aiService.js`), which sends a structured prompt (defined in `utils/promptTemplate.js` — e.g., `NOTICE_ANALYSIS_PROMPT`) to the Lyzr AI agent endpoint.
4. The AI's JSON response is parsed and sanitized by helper functions (`extractJSON`, `safeParseJSON`, `validateAnalysis`) that strip markdown code fences, recover from malformed JSON, normalize field types, and de-duplicate/limit extracted deadlines — ensuring the app is resilient to imperfect AI output.
5. The cleaned, structured result (title, summary, important points, deadlines, suggested tasks) is stored against the `Notice` document in MongoDB.

### 5.3 Eligibility, Checklist & Roadmap Generation
- The `eligibilityController`/`Eligibility` model compares the notice's extracted eligibility criteria with the student's `StudentProfile` data to compute a match result.
- The `checklistController` and `Task` model turn the AI-suggested action items into an interactive, trackable checklist.
- The `roadmapController` and `Roadmap` model organize tasks into an ordered, step-by-step plan for the student to follow.

### 5.4 Deadlines & Reminders
- Deadlines extracted during analysis are normalized (title, type, date, priority) and stored via the `Deadline` model.
- `services/notification/reminderService.js` runs as a background service that checks upcoming deadlines and triggers reminder notifications, exposed through the `Reminder` model and `/api/reminders` endpoints.

### 5.5 AI Chat
- The `chatController` and `Chat` model support a conversational endpoint (`POST /api/chat`) where a student can ask follow-up questions about a specific notice. The same `aiService` is reused with a different prompt template (`NOTICE_CHAT_PROMPT`) to keep responses grounded in the notice content.

### 5.6 Authentication & Security
- Registration/login (`authController`, `authRoutes`) issue JWTs on successful login; protected routes are guarded by an authentication middleware that validates the token.
- Passwords are hashed with **bcryptjs** before storage.
- **Helmet** sets secure HTTP headers; **express-rate-limit** caps requests to 200 per 15 minutes per IP to mitigate abuse; **CORS** is restricted to the configured frontend origin (`CLIENT_URL`).

### 5.7 API Overview
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive a JWT |
| GET/PUT | `/api/profile` | Get/update student profile |
| POST | `/api/notices/upload` | Upload a notice (PDF/DOCX) |
| GET | `/api/notices` | List all notices |
| GET | `/api/notices/:id` | Get a specific notice |
| GET | `/api/eligibility/:noticeId` | Check eligibility for a notice |
| GET | `/api/deadlines` | Get all tracked deadlines |
| GET/POST | `/api/checklist/:noticeId` | Get/update a notice's checklist |
| GET | `/api/roadmap/:noticeId` | Get the action roadmap for a notice |
| POST | `/api/chat` | Chat with the AI about a notice |
| GET/POST | `/api/reminders` | Get/create reminders |
| GET | `/api/dashboard` | Get dashboard summary |
| GET | `/api/health` | Health check |

### 5.8 Setup Summary
- **Backend:** `cd backend && npm install`, configure `.env` (`PORT`, `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, plus `AI_API_KEY` / `AI_BASE_URL` / `LYZR_AGENT_ID` for AI features), then `npm run dev` (nodemon) or `npm start`. Runs at `http://localhost:5000`.
- **Frontend:** `cd frontend && npm install`, configure `.env` (`VITE_API_URL`), then `npm run dev`. Runs at `http://localhost:5173`.

---

## 6. Future Scope

- **Multi-institution support:** Allow colleges/universities to onboard as organizations and push notices directly into the system instead of relying solely on manual student uploads.
- **Push/Email/SMS notifications:** Extend reminders beyond in-app alerts to email, SMS, or push notifications (e.g., via a service like Firebase Cloud Messaging or Twilio).
- **Improved OCR:** Strengthen the existing `ocrService.js` to reliably handle scanned/image-based notices with poor formatting or handwriting.
- **Multi-language support:** Parse and summarize notices published in regional languages, and let students interact with the AI chat in their preferred language.
- **Calendar integration:** Sync tracked deadlines with Google Calendar/Outlook so students receive reminders in tools they already use.
- **Analytics dashboard for institutions:** Give administrators insight into how many students viewed, were eligible for, or acted on a given notice.
- **Offline/mobile app:** A companion mobile application (React Native/Flutter) for on-the-go notice tracking and push reminders.
- **Fine-tuned/custom AI model:** Replace or complement the general-purpose Lyzr agent with a model fine-tuned specifically on academic notice formats for higher extraction accuracy.
- **Role-based access control:** Add administrator/faculty roles for verifying notices, managing institutional announcements, and moderating content.

---

## 7. References / Bibliography

1. Notice2Action GitHub Repository — https://github.com/JoyceHanan/Notice2Action
2. React Documentation — https://react.dev/
3. Vite Documentation — https://vitejs.dev/
4. Tailwind CSS Documentation — https://tailwindcss.com/docs
5. React Router Documentation — https://reactrouter.com/
6. Express.js Documentation — https://expressjs.com/
7. MongoDB Documentation — https://www.mongodb.com/docs/
8. Mongoose Documentation — https://mongoosejs.com/docs/
9. JSON Web Tokens (JWT) — https://jwt.io/introduction
10. Multer (npm) — https://www.npmjs.com/package/multer
11. pdf-parse (npm) — https://www.npmjs.com/package/pdf-parse
12. Mammoth.js (npm) — https://www.npmjs.com/package/mammoth
13. bcryptjs (npm) — https://www.npmjs.com/package/bcryptjs
14. Helmet.js — https://helmetjs.github.io/
15. express-rate-limit (npm) — https://www.npmjs.com/package/express-rate-limit
16. Cloudinary Documentation — https://cloudinary.com/documentation
17. Lyzr AI Platform — https://www.lyzr.ai/

---


> **Turn notices into actions.** A full-stack web application that helps students parse, understand, and act on academic/institutional notices — with AI-powered eligibility checks, deadline tracking, checklists, roadmaps, and smart reminders.

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 19.x | UI Framework |
| Vite | 5.x | Build Tool & Dev Server |
| Tailwind CSS | 4.1.x | Styling |
| React Router | 7.x | Client-side Routing |
| Axios | 1.x | HTTP Client |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | 18+ | Runtime |
| Express.js | 4.x | Web Framework |
| MongoDB + Mongoose | 8.x | Database & ODM |
| JWT | 9.x | Authentication |
| Multer | 1.x | File Uploads |
| pdf-parse + mammoth | latest | PDF & DOCX Parsing |
| bcryptjs | 2.x | Password Hashing |
| Helmet + Rate Limit | latest | Security |

---

## Features

-  **Notice Upload** — Upload PDF or DOCX notices and auto-parse their content
-  **AI Chat** — Chat with an AI assistant about notice details
-  **Eligibility Check** — Automatically determine if a student meets notice criteria
-  **Deadline Tracking** — Track important deadlines from notices
-  **Smart Checklists** — Auto-generated action checklists from notice content
-  **Roadmap Generator** — Step-by-step roadmaps for completing notice requirements
-  **Reminders** — Set and manage reminders for upcoming deadlines
-  **Dashboard** — Overview of all notices, deadlines, and pending tasks
-  **Student Profile** — Manage academic profile used for eligibility matching
-  **Auth** — Secure JWT-based registration & login

---

##  Project Structure

```
Notice2Action/
├── backend/                  # Express.js REST API
│   ├── config/               # Database connection
│   ├── controllers/          # Route handler logic
│   ├── middlewares/          # Auth & error middleware
│   ├── models/               # Mongoose schemas
│   │   ├── User.js
│   │   ├── Notice.js
│   │   ├── Eligibility.js
│   │   ├── Reminder.js
│   │   ├── Roadmap.js
│   │   └── Chat.js
│   ├── routes/               # API route definitions
│   ├── services/             # Background services (reminders)
│   ├── uploads/              # Uploaded notice files
│   ├── utils/                # Helper utilities
│   ├── server.js             # App entry point
│   └── package.json
│
└── frontend/                 # React + Vite SPA
    ├── src/
    │   ├── api/              # Axios API calls
    │   ├── components/       # Reusable UI components
    │   ├── context/          # React context (Auth, etc.)
    │   ├── pages/             # Page components
    │   │   ├── Dashboard.jsx
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── UploadNotice.jsx
    │   │   ├── NoticeDetails.jsx
    │   │   ├── Profile.jsx
    │   │   └── Reminders.jsx
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

---

##  Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [MongoDB](https://www.mongodb.com/) (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- npm v9+

---

## Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/Notice2Action.git
cd Notice2Action
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
# Development (with hot-reload)
npm run dev

# Production
npm start
```

The backend will run at **http://localhost:5000**

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

The frontend will run at **http://localhost:5173**

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT token |
| GET/PUT | `/api/profile` | Get/update student profile |
| POST | `/api/notices/upload` | Upload a notice (PDF/DOCX) |
| GET | `/api/notices` | Get all notices |
| GET | `/api/notices/:id` | Get a specific notice |
| GET | `/api/eligibility/:noticeId` | Check eligibility for a notice |
| GET | `/api/deadlines` | Get all tracked deadlines |
| GET/POST | `/api/checklist/:noticeId` | Get/update notice checklist |
| GET | `/api/roadmap/:noticeId` | Get action roadmap for a notice |
| POST | `/api/chat` | Chat with AI about a notice |
| GET/POST | `/api/reminders` | Get/create reminders |
| GET | `/api/dashboard` | Get dashboard summary |
| GET | `/api/health` | Health check |

---

##  Security

- JWT-based authentication with protected routes
- Helmet.js for HTTP security headers
- Rate limiting: 200 requests per 15 minutes per IP
- Password hashing with bcryptjs
- CORS restricted to frontend origin

---

##  Development Scripts

### Backend
```bash
npm run dev    # Start with nodemon (hot-reload)
npm start      # Start in production mode
```

### Frontend
```bash
npm run dev     # Start Vite dev server
npm run build   # Build for production
npm run preview # Preview production build
npm run lint    # Run ESLint
```

---

## Dependencies Overview

### Backend Dependencies
```
express, mongoose, jsonwebtoken, bcryptjs,
multer, pdf-parse, mammoth, cors, helmet,
express-rate-limit, morgan, dotenv
```

### Frontend Dependencies
```
react, react-dom, react-router,
axios, tailwindcss, @tailwindcss/vite
```

---

##  Contributors

katukojwala sreemaye
joyce hanan
Amulya Mandala
jakkula Rithvika
Krishnaveni
