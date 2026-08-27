#  Notice2Action

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
    │   ├── pages/            # Page components
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

##  Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to branch: `git push origin feature/my-feature`
5. Open a Pull Request

---


