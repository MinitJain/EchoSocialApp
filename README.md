# Echo

<div align="center">

[![Node.js](https://img.shields.io/badge/Node.js-22%2B-339933?logo=node.js&style=flat-square)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18%2B-61DAFB?logo=react&style=flat-square)](https://react.dev)
[![Gemini 3 Flash](https://img.shields.io/badge/Gemini%203%20Flash-2026-4285F4?logo=google&style=flat-square)](https://deepmind.google/technologies/gemini)
[![License](https://img.shields.io/badge/License-MIT-yellowgreen?style=flat-square)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen?style=flat-square)](#)

</div>

---

## Core Concept

**Echo** is an AI-powered social media assistant built on the MERN stack that helps users craft better posts and understand social media etiquette. The platform provides intelligent, real-time coaching through a conversational AI interface, enabling users to improve their social media presence with actionable insights and best practices.

---

## Tech Stack

| Category     | Technologies                                                                  |
| ------------ | ----------------------------------------------------------------------------- |
| **Frontend** | React 19, Vite, Redux Toolkit, Tailwind CSS, React Router, Axios, React Icons |
| **Backend**  | Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs                         |
| **AI / ML**  | Google Gemini 3 Flash (2026 Unified SDK), @google/genai                       |
| **Security** | Helmet, CORS, JWT Cookie Authentication, Rate Limiting                        |

---

## Project Structure

```
echo/
├── backend/
│   ├── config/
│   │   ├── auth.js           # JWT authentication middleware
│   │   └── database.js       # MongoDB connection
│   ├── controllers/
│   │   ├── ai.controller.js  # AI chat logic
│   │   ├── tweet.controller.js
│   │   └── user.controller.js
│   ├── models/
│   │   ├── tweet.model.js    # Tweet schema
│   │   └── user.model.js     # User schema
│   ├── routes/
│   │   ├── ai.routes.js      # /api/v1/ai endpoints
│   │   ├── tweet.routes.js   # /api/v1/tweet endpoints
│   │   └── user.routes.js    # /api/v1/user endpoints
│   ├── src/
│   │   ├── app.js            # Express app configuration
│   │   └── server.js         # Server entry point
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js      # Axios instance with credentials
│   │   ├── components/
│   │   │   ├── AIChatBot.jsx
│   │   │   ├── Body.jsx
│   │   │   ├── Bookmarks.jsx
│   │   │   ├── CreatePost.jsx
│   │   │   ├── EditProfile.jsx
│   │   │   ├── Feed.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── LeftSidebar.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── MobileNav.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── RightSideBar.jsx
│   │   │   ├── ThemeToggle.jsx
│   │   │   ├── Tweet.jsx
│   │   │   └── ui/
│   │   │       └── scrollFade.jsx
│   │   ├── hooks/
│   │   │   ├── useGetProfile.js
│   │   │   ├── useGetTweets.js
│   │   │   ├── useOtherUsers.js
│   │   │   └── useTheme.js
│   │   ├── redux/
│   │   │   ├── store.js
│   │   │   ├── tweetSlice.js
│   │   │   └── userSlice.js
│   │   ├── utils/
│   │   │   └── constant.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── package.json              # Root orchestration scripts
└── README.md
```

---

## Installation & Setup

### Prerequisites

- Node.js v22+
- MongoDB instance (local or Atlas)

### Clone & Install

```bash
# Clone the repository
git clone https://github.com/MinitJain/Echo-Socials
cd echo

# Install all dependencies
npm run install-all
```

### Start Development Environment

```bash
# Run both frontend and backend concurrently
npm run dev
```

> [!TIP]
> Backend runs on `http://localhost:8080` and frontend on `http://localhost:5173`

---

## Environment Configuration

### Backend Variables

Create a `backend/.env` file with the following variables:

```env
# Server Configuration
PORT=8080

# Database
MONGODB_URI=mongodb://localhost:27017/echo

# Authentication
JWT_SECRET=your_secure_jwt_secret_min_32_chars

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# AI Configuration
GEMINI_API_KEY=your_google_gemini_api_key
```

> [!IMPORTANT]
>
> - `GEMINI_API_KEY` is **required** for the AI chat functionality to work
> - Obtain your API key from [Google AI Studio](https://aistudio.google.com/app/apikey)
> - JWT tokens are stored in HTTP-only cookies for security

### Frontend Variables

Create a `frontend/.env` file:

```env
VITE_API_URL=http://localhost:8080
```

---

## API Reference

### AI Chat Endpoint

#### POST /api/v1/ai/chat

Send a message to the Echo AI assistant.

**Headers**

```http
Authorization: Bearer <token>
Content-Type: application/json
```

> [!IMPORTANT]
> This endpoint is protected by the `isAuthenticated` middleware. Requests without a valid JWT token will receive a 401 Unauthorized response.

**Request Body**

```json
{
  "message": "How do I grow my reach?",
  "history": [
    { "role": "user", "parts": [{ "text": "Hello" }] },
    {
      "role": "model",
      "parts": [{ "text": "Hi! I'm Echo, your social media guide..." }]
    }
  ]
}
```

**Response**

```json
{
  "response": "To grow your reach on social media, consider these strategies: 1) Post consistently..."
}
```

**Error Responses**

```json
{
  "error": "Message is required",
  "code": 400
}
```

```json
{
  "error": "Invalid or expired token",
  "success": false
}
```

---

## Architectural Highlights

### Stateless AI Implementation

Echo implements a **stateless AI architecture** where conversation history is mapped and sent within the `contents` array of each `generateContent` request. This approach ensures:

- **Maximum reliability** — No server-side session state that could fail
- **Horizontal scalability** — Any backend instance can handle any request
- **Simplified deployment** — No Redis or session storage required

### Unified SDK Integration

The project uses the **2026 Unified @google/genai SDK** (`@google/genai` v1.x) for seamless model interaction:

```javascript
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const response = await ai.models.generateContent({
  model: "gemini-3-flash-preview",
  contents: [...history, { role: "user", parts: [{ text: message }] }],
  config: {
    systemInstruction: SYSTEM_PROMPT,
    temperature: 0.7,
    maxOutputTokens: 500,
  },
});
```

### Secure API Routing

All AI routes are protected by custom JWT middleware:

```javascript
router.post("/chat", isAuthenticated, chatWithAI);
```

The `isAuthenticated` middleware verifies the HTTP-only cookie JWT token and attaches the user ID to `req.user`.

---

## Development Roadmap

| Milestone                | Description                                                            |
| ------------------------ | ---------------------------------------------------------------------- |
| **Streaming Responses**  | Implement server-sent events (SSE) for real-time AI response streaming |
| **Sentiment Analysis**   | Add post-content sentiment scoring for engagement optimization         |
| **Multi-Modal Support**  | Enable image analysis and generation for visual content suggestions    |
| **Rate Limiting**        | Per-user AI request quotas with configurable tiers                     |
| **Conversation Context** | Persistent user preferences and interaction history                    |
| **Analytics Dashboard**  | User engagement metrics and AI recommendation tracking                 |

---

## License

MIT
