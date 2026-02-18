# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Global theme support (works before/after login, on refresh, across all routes)
- Theme toggle in Login/Signup pages (top-right corner)
- Theme option in Desktop Sidebar (above Logout)
- Theme option in Mobile Nav (before Logout)
- Smooth theme transitions with transition-colors

### Removed
- Floating theme toggle button (bottom-right)

### Fixed
- Login/Signup pages now support both light and dark themes
- MobileNav now supports light and dark themes
- Theme now persists correctly with system preference fallback
- Hydration flicker prevented with proper theme initialization
- Backend refactoring: Updated import paths for new directory structure
  - `src/app.js`: Fixed route imports from `./routes/` to `../routes/`
  - `src/server.js`: Fixed app and database imports from `./` to `../`
  - `controllers/user.controller.js`: Fixed model imports from `userSchema.js/tweetSchema.js` to `user.model.js/tweet.model.js`
  - `controllers/tweet.controller.js`: Fixed model imports to `.model.js` extension
  - `routes/user.routes.js`: Fixed controller import from `userController.js` to `user.controller.js`
  - `routes/tweet.routes.js`: Fixed controller import from `tweetController.js` to `tweet.controller.js`
  - `package.json`: Updated start/dev scripts to point to `src/server.js` instead of `index.js`
- CopilotKit completely removed from the project:
  - Uninstalled `@copilotkit/react-ui` and `@copilotkit/react-core` npm packages
  - Deleted `CopilotHelper.jsx` component
  - Removed CopilotKit provider from `main.jsx`
  - Removed AI modal from `Home.jsx` (including `aiOpen` state and related effects)
  - Removed Echo AI button from `LeftSidebar.jsx`
  - Removed elevated AI button from `MobileNav.jsx`
  - Removed CopilotKit content path from `tailwind.config.js`

### Verified
- Server startup: PORT correctly defaults to 8080 (from `process.env.PORT || 8080`)
- Database connection: Path correctly points to `../config/database.js`
- API base URL compatibility: Frontend `.env` configured for `http://localhost:8080/api/v1`
- CORS configuration: Allows `localhost:5173` and environment `FRONTEND_URL`

### Notes
- Old `index.js` file remains in place (commented out) for reference - can be removed after verification
- Backend entry point is now `src/server.js`

---

**Date:** Tue Feb 17 2026 00:00:00 UTC
