# TASKS.md — Rugendo Rwanda

## How to use this file

- Update this file after every meaningful implementation batch.
- Move items from TODO to COMPLETED when done; never delete them.
- Keep task descriptions short and specific — this is a status tracker, not a spec.
- If a task uncovers a new sub-task, add it inline under the parent.
- Current phase label must be updated when the phase changes.

---

## Current Phase: Phase 3 — Route Search & Schedule Discovery (implemented; migration + seeding + manual testing pending)

---

## TODO

### Database Setup

- [ ] Start MySQL server and run `npx prisma migrate dev --name init` (blocked: MySQL not running)
- [ ] Verify all tables created correctly in MySQL
- [ ] Run seed: `node prisma/seed.js` to create one user per role for testing

### Auth — Manual Testing Required

- [ ] Test `POST /api/auth/register` with email + Rwanda phone
- [ ] Test `POST /api/auth/login` with email identifier
- [ ] Test `POST /api/auth/login` with Rwanda phone identifier
- [ ] Test `POST /api/auth/refresh` with valid refresh token
- [ ] Test `POST /api/auth/logout`
- [ ] Test `GET /api/me` with valid access token
- [ ] Test `POST /api/auth/forgot-password` (check console for reset link in dev)
- [ ] Test `POST /api/auth/reset-password` with valid token
- [ ] Test `POST /api/auth/google` with a real Google credential
- [x] Implement role-based redirect after login (passenger → `/`, others → their dashboard)
- [x] Avatar/user dropdown in navbar (Profile, Dashboard, Logout) for all logged-in roles
- [x] Dashboard dark-mode default (applies if no theme preference stored)
- [x] Sidebar: Profile + Homepage links for all roles
- [x] Shared `/profile` route accessible to all authenticated roles
- [ ] Verify role-based redirect to correct dashboard after login
- [ ] Verify ProtectedRoute blocks unauthenticated access
- [ ] Verify ProtectedRoute blocks wrong-role access
- [ ] Verify Google button renders on login and register pages

### Theme and Language Verification

- [ ] Verify dark / light mode toggle works and persists preference
- [ ] Verify language-switching scaffold is in place (string keys, locale file structure)
- [ ] Confirm no hardcoded UI strings that would block future i18n

### Near-Next (After Auth is Solid)

- [x] Route search — `GET /api/schedules/search?from=&to=&date=&seats=`
- [x] Public routes listing — `GET /api/routes`
- [x] Schedule listing for a route and date (real API, loading/error/empty states)
- [x] Seat count selection on booking summary page
- [x] Schedule selection handoff — `BookingPage` loads schedule by ID, shows summary, passes state toward payment
- [x] Seed data — companies, buses, drivers, routes, schedules for testing search
- [ ] Booking creation — `POST /api/bookings`
- [ ] Simulated payment flow — `POST /api/payments`
- [ ] Booking token / reference generation (unique, human-readable)
- [ ] Booking confirmation page
- [ ] My Bookings page (upcoming trips)
- [ ] Past Trips page
- [ ] Booking details page
- [ ] Admin: user management CRUD
- [ ] Admin: route management CRUD
- [ ] Admin: schedule management CRUD
- [ ] Admin: bus management CRUD
- [ ] Admin: driver management CRUD
- [ ] Admin: booking management view
- [ ] Admin: payment record view
- [ ] Operator: boarding validation flow
- [ ] Super-admin: platform settings page

---

## COMPLETED

### Phase 1 — Scaffolding

- [x] Initialize project repository
- [x] Set up frontend with Vite + React + Tailwind CSS
- [x] Set up backend with Express.js + ES modules
- [x] Set up modular backend folder structure (routes, controllers, middleware, prisma)
- [x] Initialize Prisma with MySQL provider
- [x] Scaffold auth routes and controllers (stubbed)
- [x] Scaffold role-based frontend layouts (passenger, admin, super-admin, operator)
- [x] Scaffold frontend pages for all major sections (placeholder content)

### Phase 2 — Schema + Auth Implementation

- [x] Review and verify Prisma schema against all business requirements
- [x] Add googleId, passwordResetToken, passwordResetExpiresAt fields; make passwordHash nullable; add phone @unique
- [x] Implement `POST /api/auth/register` — name, email, Rwanda phone, password; duplicate checks
- [x] Implement `POST /api/auth/login` — supports email OR Rwanda phone as identifier
- [x] Implement `POST /api/auth/refresh` — rotate refresh token
- [x] Implement `POST /api/auth/logout` — delete refresh token from DB
- [x] Implement `GET /api/me` and `GET /api/auth/me`
- [x] Implement `POST /api/auth/forgot-password` — generate reset token (logs to console in dev)
- [x] Implement `POST /api/auth/reset-password` — validate token, update password, clear token
- [x] Implement `POST /api/auth/google` — verify Google ID token, find/create/link user
- [x] Rwanda phone validation regex on both backend (Zod) and frontend
- [x] Role normalization in AuthContext: DB enum (SUPER_ADMIN) → frontend (super_admin)
- [x] Fix refresh token flow in api.js — send token in body, not empty body
- [x] Update LoginPage — identifier field (email or phone), Google sign-in button
- [x] Update RegisterPage — required phone with Rwanda validation hint, Google sign-up button
- [x] Fix role strings in router.jsx — super-admin → super_admin (consistent with normalization)
- [x] Add `requireRole` middleware (already existed; wired into auth routes)
- [x] Seed script: `prisma/seed.js` with one user per role
- [x] Frontend `.env` with VITE_GOOGLE_CLIENT_ID
