## Echo 🚀

**Echo** is a production-oriented, AI-ready **microblogging platform** built with the **MERN stack**.  
It is designed to demonstrate **scalable full-stack architecture**, **secure authentication**, **clean API design**, and **modern frontend infrastructure** using **Vite** and **Tailwind CSS**.

> ⚠️ This is **not** a tutorial project.  
> The structure, configuration, and deployment model reflect **real-world production practices**.

---

## ✨ Key Highlights

- **Secure, cookie-based JWT authentication**
- **Production-ready CORS configuration**
- **Clear backend separation of concerns**
- **Modern frontend architecture (Vite + React 19)**
- **AI integration-ready structure (Copilot-style assistant)**

---

## 🏗 Architecture Overview

Echo is structured as a **monorepo** with a clear separation between frontend and backend services.

```text
echo/
├── backend/              # Express API server
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── index.js
│   └── ...
│
├── frontend/             # React + Vite application
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── redux/
│   │   ├── Hooks/
│   │   ├── utils/
│   │   ├── main.jsx
│   │   └── App.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── ...
│
├── package.json          # Root orchestration scripts
└── README.md
```

---

## 🛠 Tech Stack

### Backend

- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **JWT** (HTTP-only cookie authentication)
- **bcrypt** (password hashing)
- **Helmet** (security headers)
- **CORS** (strict origin control)
- **Rate limiting** (authentication endpoints)

### Frontend

- **React 19**
- **Vite**
- **Redux Toolkit**
- **React Router**
- **Axios**
- **Tailwind CSS v3**
- **CopilotKit** (AI integration layer)

---

## 🚀 Deployment

- **Backend**: Render  
- **Frontend**: Vercel

---

## 🔐 Core Capabilities

### Authentication

- **JWT stored in secure HTTP-only cookies**
- **Password hashing with bcrypt**
- **`/me` endpoint for session hydration**
- **Protected routes via middleware**
- **Proper cross-origin credential handling**

### Social Features

- **Post creation & deletion**
- **Like / unlike posts**
- **Bookmarking**
- **Follow / unfollow users**
- **User profiles**
- **Feed aggregation**

### 🤖 AI-Ready Architecture

Echo integrates **CopilotKit** and is structured to support:

- **Assisted post composition**
- **Intelligent UX enhancements**
- **Context-aware AI features**
- **Modular AI service integration**

---

## ⚙️ Environment Configuration

### Backend (`backend/.env`)

```env
PORT=8080
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_secret
FRONTEND_URL=https://your-vercel-domain.vercel.app

```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=https://your-backend-domain.onrender.com
```

> ⚠️ **Important**:  
> Frontend environment variables must use the `VITE_` prefix.  
> Vite does not expose other environment variables to the client.

---

## 🧪 Local Development

### Install Dependencies

From the project root:

```bash
npm run install-all
```

Or manually:

```bash
cd backend && npm install
cd ../frontend && npm install
```

### Run Development Servers

From the root directory:

```bash
npm run dev
```


This runs:

Backend: http://localhost:8080

Frontend: http://localhost:5173

Verify Backend Health
curl http://localhost:8080/api/health


Expected response:

{
  "status": "ok"
}

---

## 📦 Production Build

To build the frontend:

```bash
cd frontend
npm run build
```

Vite outputs static assets to:

- `frontend/dist/`

---

## ☁️ Deployment Guide

### Frontend (Vercel)

- **Framework**: Vite  
- **Root Directory**: `frontend`  
- **Build Command**: `npm run build`  
- **Output Directory**: `dist`

**Environment Variables**

- `VITE_API_URL=https://your-render-backend.onrender.com`

### Backend (Render)

- Deploy from `/backend`
- Set environment variables in the Render dashboard
- Ensure `FRONTEND_URL` matches your Vercel domain
- Enable credentials in CORS configuration

---

## 🔒 Security Considerations

- **JWT stored in HTTP-only cookies**
- **CORS configured with strict origin whitelist**
- **Credentials enabled for cross-origin requests**
- **Passwords hashed with bcrypt**
- **Helmet used for secure HTTP headers**
- **Environment variables for all secrets**
- **No credentials committed to the repository**

---

## 🌐 CORS Model

The backend allows:

- **Local development origins** (`localhost:5173`, etc.)
- **Production frontend domain** via `FRONTEND_URL`

Cookies are transmitted using Axios:

```js
axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});
```

The server must respond with:

- `credentials: true`

---

## 📜 Build & Script Reference

### Root `package.json` Scripts

```json
{
  "dev": "concurrently \\"cd backend && npm run dev\\" \\"cd frontend && npm run dev\\"",
  "build": "cd frontend && npm run build",
  "install-all": "cd backend && npm install && cd ../frontend && npm install",
  "start": "cd backend && npm start"
}
```

---

## ✅ Production Readiness Notes

- **Vite** replaces CRA for modern ESM-based builds
- **Tailwind v3** ensures stable PostCSS compatibility
- **PostCSS config** uses CommonJS (`.cjs`) for Vite compatibility
- **Lockfiles** regenerated post-migration
- No **CRA artifacts** remain
- No `REACT_APP_*` variables remain

---

## ⚠️ Known Limitations

- No real-time WebSocket notifications
- No media upload support
- No horizontal scaling (single backend instance)
- No automated test suite included

---

## 🔮 Future Improvements

- Real-time notifications (WebSockets)
- Media uploads (S3 or Cloudinary)
- Infinite scrolling with cursor-based pagination
- Horizontal scaling with Redis-backed session control
- Observability integration (OpenTelemetry)
- AI-based moderation pipeline

---

## 📄 License

MIT

---

## 👤 Maintainer

**Minit Jain**

If you're a recruiter, mentor, or developer reviewing this project — feel free to explore, fork, or reach out!
