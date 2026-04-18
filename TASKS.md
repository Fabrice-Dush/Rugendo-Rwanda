# TASKS.md — Rugendo Rwanda

## How to use this file

- Update this file after every meaningful implementation batch.
- Move items from TODO to COMPLETED when done; never delete them.
- Keep task descriptions short and specific — this is a status tracker, not a spec.
- If a task uncovers a new sub-task, add it inline under the parent.
- Current phase label must be updated when the phase changes.

---

## Current Phase: Phase 4 — Booking, Simulated Payment & Confirmation (implemented; migration + manual testing pending)

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

### Boarding — Manual Testing Required

- [x] Boarding lookup: reference-only (`?query=RW-XXXXXXXX`); phone/email search removed
- [x] Boarding lookup returns array of 0 or 1 booking (company-scoped for operators)
- [x] Operator UI: single reference search field, detail + validate view
- [x] Operator company bookings: `GET /api/bookings/operator-company` — company-scoped booking list with seat availability
- [x] Operator bookings page: `/operator/bookings` — shows passenger, reference, route, departure, seats booked, seats remaining, status, payment
- [x] Seed data updated: 7 diverse bookings across both companies covering all states
- [ ] Test `GET /api/boarding/lookup?query=RW-A11CE001` (Volcano op — found, boardable)
- [ ] Test `GET /api/boarding/lookup?query=RW-B0B00002` (Volcano op — 403)
- [ ] Test `GET /api/boarding/lookup?query=RW-B0B00002` (Horizon op — found)
- [ ] Test `POST /api/boarding/validate` success path on RW-A11CE001 (CONFIRMED+PAID)
- [ ] Test boarding validation rejects RW-A11CE002 (PENDING), RW-B0B00001 (CANCELLED), RW-CA01CA01 (COMPLETED)
- [ ] Test `GET /api/bookings/operator-company` as operator@test.rw → Volcano bookings
- [ ] Test `GET /api/bookings/operator-company` as operator2@test.rw → Horizon bookings only
- [ ] Verify operator company banner shows company name on bookings page
- [ ] Verify seats-remaining column colours correctly (0=red, ≤5=amber, else green)

### Near-Next (After Auth is Solid)

- [x] Route search — `GET /api/schedules/search?from=&to=&date=&seats=`
- [x] Public routes listing — `GET /api/routes`
- [x] Schedule listing for a route and date (real API, loading/error/empty states)
- [x] Seat count selection on booking summary page
- [x] Schedule selection handoff — `BookingPage` loads schedule by ID, shows summary, passes state toward payment
- [x] Seed data — companies, buses, drivers, routes, schedules for testing search
- [x] Booking creation — `POST /api/bookings`
- [x] Simulated payment flow — `POST /api/payments/pay`
- [x] Booking token / reference generation (unique, human-readable) — format: RW-XXXXXXXX
- [x] Booking confirmation page — `/passenger/booking-confirm`
- [x] My Bookings page (upcoming trips + past grouping) — `/passenger/bookings`
- [ ] Past Trips page (basic grouping in MyBookings; dedicated page is future)
- [x] Cancel booking — `PATCH /api/bookings/:id/cancel` (PENDING-only; service + controller + route implemented)
- [x] Retry payment after FAILED — backend upserts existing payment record; duplicate-payment guard tightened
- [x] My Bookings: Retry Payment + Cancel Booking actions for PENDING bookings
- [x] Signup: email OR phone required (not both) — backend validator + frontend form + auth service
- [x] Prisma schema: email made nullable (String?) so phone-only registration stores null email correctly
- [x] Duplicate booking guard: backend blocks second PENDING/CONFIRMED booking for same user + scheduleId (409)
- [x] Departure time guard: backend blocks booking at or after departureTime (400); frontend disables button and shows warning
- [x] Profile page: view info, update name/email/phone, permanently delete account with confirmation
- [x] Account deletion: DELETE /api/users/me route correctly wired; post-deletion navigate is decoupled from logout call
- [x] Password show/hide toggle on Login, Register, Reset Password forms
- [ ] Booking details page
- [ ] Admin: user management CRUD
- [ ] Admin: route management CRUD
- [ ] Admin: schedule management CRUD
- [ ] Admin: bus management CRUD
- [ ] Admin: driver management CRUD
- [ ] Admin: booking management view
- [ ] Admin: payment record view
- [x] Operator: boarding validation flow (backend + frontend; scope enforcement bug fixed; seed booking added)
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
