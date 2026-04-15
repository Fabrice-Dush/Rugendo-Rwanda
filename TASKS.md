# TASKS.md — Rugendo Rwanda

## How to use this file

- Update this file after every meaningful implementation batch.
- Move items from TODO to COMPLETED when done; never delete them.
- Keep task descriptions short and specific — this is a status tracker, not a spec.
- If a task uncovers a new sub-task, add it inline under the parent.
- Current phase label must be updated when the phase changes.

---

## Current Phase: Phase 2 — Schema Verification + Auth Implementation

---

## TODO

### Foundation Verification

- [ ] Review frontend scaffold — confirm folder structure, routing, and role layouts are correct
- [ ] Review backend scaffold — confirm module structure, middleware wiring, and entry point
- [ ] Review Prisma schema against all business requirements (roles, booking statuses, payment statuses, relations)
- [ ] Confirm all five roles are modelled correctly: `guest`, `passenger`, `admin`, `super_admin`, `operator`
- [ ] Confirm booking status values: `pending`, `confirmed`, `cancelled`, `completed`
- [ ] Confirm payment status values: `pending`, `paid`, `failed`, `refunded`
- [ ] Confirm schedule ↔ booking ↔ payment relations are complete
- [ ] Confirm seat reservation model exists or plan it

### Database Setup

- [ ] Configure backend `.env` with correct MySQL connection string
- [ ] Run `npx prisma migrate dev --name init` and verify it succeeds
- [ ] Verify all tables created correctly in MySQL (check via Prisma Studio or MySQL client)
- [ ] Decide on seed strategy: manual fixtures or Prisma seed script
- [ ] Seed at least one admin user, one route, and one schedule for testing

### Auth Implementation (Backend)

- [ ] Implement `POST /api/auth/register` — validate input, hash password, create passenger user
- [ ] Implement `POST /api/auth/login` — validate credentials, issue access token + refresh token
- [ ] Implement `POST /api/auth/refresh` — validate refresh token, issue new access token
- [ ] Implement `POST /api/auth/logout` — invalidate refresh token
- [ ] Implement `GET /api/me` — return current user profile from access token
- [ ] Implement `POST /api/auth/forgot-password` — generate reset token, store it
- [ ] Implement `POST /api/auth/reset-password` — validate token, update password
- [ ] Protect backend routes by role using middleware (`requireAuth`, `requireRole`)
- [ ] Verify token expiry handling (access: short-lived, refresh: longer-lived)

### Frontend Auth Integration

- [ ] Connect Register page to `POST /api/auth/register`
- [ ] Connect Login page to `POST /api/auth/login`
- [ ] Connect Forgot Password page to `POST /api/auth/forgot-password`
- [ ] Connect Reset Password page to `POST /api/auth/reset-password`
- [ ] Persist auth session correctly (store access token in memory, refresh token in httpOnly cookie or localStorage with risk awareness)
- [ ] Implement auto-refresh of access token using refresh token
- [ ] Implement role-based redirect after login:
  - `passenger` → `/dashboard` or `/`
  - `admin` → `/admin`
  - `super_admin` → `/super-admin`
  - `operator` → `/operator`
- [ ] Implement logout — clear tokens, redirect to home
- [ ] Verify protected frontend routes block unauthenticated access
- [ ] Verify role-gated frontend routes block wrong roles

### Theme and Language Verification

- [ ] Verify dark / light mode toggle works and persists preference
- [ ] Verify language-switching scaffold is in place (string keys, locale file structure)
- [ ] Confirm no hardcoded UI strings that would block future i18n

### Near-Next (After Auth is Solid)

- [ ] Route search — `GET /api/routes/search?from=&to=&date=`
- [ ] Schedule listing for a route and date
- [ ] Seat selection / count selection
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
