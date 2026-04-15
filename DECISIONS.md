# DECISIONS.md — Rugendo Rwanda

A numbered log of architectural and product decisions made during this project.
Add a new entry whenever a meaningful decision is made. Never delete entries — mark superseded ones as `[SUPERSEDED by #N]`.

Format: `## N. Title` → `**Decision:**` → `**Why:**` → `**Date:**`

---

## 1. Stack: React + Vite + Tailwind (Frontend)

**Decision:** Frontend uses React.js, Vite as build tool, and Tailwind CSS for styling. JavaScript/JSX only — no TypeScript.

**Why:** Fastest setup for a booking platform MVP. Tailwind keeps styling consistent without fighting CSS specificity. TypeScript is deferred to avoid slowing down the initial build phase; it can be added later if the team grows.

**Date:** Project start

---

## 2. Stack: Node.js + Express + Prisma + MySQL (Backend)

**Decision:** Backend is Node.js with Express.js, using Prisma ORM over a MySQL database. ES modules only — no CommonJS.

**Why:** Standard, well-documented stack suitable for REST APIs. Prisma gives a typed query builder with migration support. MySQL is widely available and fits a relational booking data model well. ES modules enforced from the start to avoid mixed-module pain later.

**Date:** Project start

---

## 3. No Redis in MVP

**Decision:** Redis (or any in-memory store) is not used in the MVP. Refresh token invalidation handled in the MySQL database.

**Why:** Adding Redis increases operational complexity and requires an additional service. For MVP scale, storing refresh tokens in MySQL is sufficient. Redis can be introduced later for caching and token blocklists if needed.

**Date:** Project start

---

## 4. Role Model: Five Roles

**Decision:** The platform has exactly five roles: `guest`, `passenger`, `admin`, `super_admin`, `operator`. There is no separate "boarding agent" role.

**Why:** Keeping roles minimal reduces complexity. Operators already handle boarding validation — a dedicated boarding-agent role would duplicate scope with no benefit at this stage.

**Date:** Project start

---

## 5. Super-admin Scope

**Decision:** `super_admin` has all `admin` permissions plus exclusive access to platform-wide settings and appearance controls.

**Why:** Super-admin needs to be a strict superset of admin so that platform-level configuration is never blocked by permission gaps. Operators and admins should not access platform settings.

**Date:** Project start

---

## 6. MVP Must Include Operational Workflows, Not Only Passenger UI

**Decision:** The MVP is not a passenger-only web app. Admin, super-admin, and operator dashboards are in scope for MVP.

**Why:** Without operational tooling, the platform cannot be used in production — routes, schedules, buses, and drivers cannot be managed, and boarding cannot be validated. A passenger-only frontend with no backend operations is not a launchable product.

**Date:** Project start

---

## 7. Dark / Light Mode Is Part of MVP

**Decision:** Dark and light mode toggle is included in the MVP passenger and admin interfaces.

**Why:** It was explicitly agreed as an MVP requirement, not a nice-to-have. Rwanda's mobile internet context means the app must work comfortably in varied lighting conditions.

**Date:** Project start

---

## 8. Multilingual-Ready Structure Is Part of MVP

**Decision:** The frontend must use a string-key structure (locale files / i18n provider) from the start, even if only one language is active at launch.

**Why:** Retrofitting i18n into a hardcoded-string codebase is expensive. Building the structure now costs little and makes adding Kinyarwanda or French translations a content task rather than a refactor.

**Date:** Project start

---

## 9. Phase 1 Was Scaffolding Only — No Business Logic

**Decision:** The first coding phase focused entirely on scaffold: folder structure, routing, layouts, Prisma init, auth stubs. No business logic was implemented.

**Why:** Aligning on structure before filling in logic prevents large-scale refactors later. Scaffold-first lets the team verify the architecture before committing to implementation details.

**Date:** Project start

---

## 11. Google Auth Uses ID Token Verification (Not OAuth Redirect Flow)

**Decision:** Google authentication uses the Google Identity Services (GIS) JavaScript SDK on the frontend. The frontend receives a Google ID token (credential), sends it to `POST /api/auth/google`, and the backend verifies it using `google-auth-library`. No OAuth redirect dance.

**Why:** React SPAs are better served by the credential callback approach than a server-side redirect flow. The GIS SDK is loaded via script tag — no frontend npm package required. The backend uses `google-auth-library` to verify the token cryptographically.

**Date:** 2026-04-15

---

## 12. Google Auth Account Linking: Link by Email, No Duplicate Accounts

**Decision:** When a user signs in with Google and an account already exists with that email (registered with password), the backend links the `googleId` to the existing account rather than creating a duplicate. This happens silently on first Google sign-in.

**Why:** Creating a second account for the same email would fragment the user's booking history and cause confusion. Linking is safe because Google has verified ownership of the email.

**Date:** 2026-04-15

---

## 13. Password Reset Token: Hex String in DB (Not JWT)

**Decision:** Forgot-password tokens are random 32-byte hex strings stored in the `passwordResetToken` field on the User model with a 1-hour expiry. In development, the reset link is logged to the console. Email delivery is a Phase 2 concern.

**Why:** A hex token stored in the DB is easier to invalidate (just clear the field) and doesn't require a separate secret for verification. JWT-based reset tokens cannot be invalidated before expiry if the DB isn't checked.

**Date:** 2026-04-15

---

## 14. Role Normalization at Frontend AuthContext Boundary

**Decision:** The backend DB stores roles as uppercase enums (`PASSENGER`, `ADMIN`, `SUPER_ADMIN`, `OPERATOR`). The frontend normalizes them to lowercase underscore convention (`passenger`, `admin`, `super_admin`, `operator`) inside `AuthContext.normalizeUser()`. All frontend role checks use the normalized form.

**Why:** Keeps DB enum naming free from frontend conventions. The mapping is in one place — `AuthContext.jsx` — so any future change (e.g. adding a new role) only needs updating there.

**Date:** 2026-04-15

---

## 15. No Email Verification in MVP

**Decision:** Email verification is not implemented. Users can log in immediately after registration without confirming their email.

**Why:** Adds friction with no email infrastructure in place. Email verification is straightforward to add later once an email service (SendGrid, Resend, etc.) is configured. It does not block the auth or booking flows.

**Date:** 2026-04-15

---

## 16. Schedule Search Is Public (No Auth Required)

**Decision:** `GET /api/schedules/search` and `GET /api/schedules/:id` are public endpoints — no authentication required. `GET /api/routes` is also public.

**Why:** Passengers (and guests) must be able to browse available trips before deciding to register or log in. Requiring auth for search would break the public discovery funnel. Auth is enforced at booking creation (`POST /api/bookings`), not search.

**Date:** 2026-04-15

---

## 17. seatsAvailable Is a Denormalized Counter on Schedule

**Decision:** `Schedule.seatsAvailable` is a denormalized integer that must be decremented/incremented atomically inside a Prisma transaction when bookings are created or cancelled.

**Why:** Computing available seats from booking joins on every search query is expensive and races under concurrent writes. A counter on the schedule row is the correct pattern for a booking platform. The schema comment documents this constraint.

**Date:** 2026-04-15

---

## 18. Booking Summary Page Passes Schedule State via React Router navigate() State

**Decision:** When a passenger selects a schedule and adjusts seat count on `BookingPage`, the handoff to payment passes `{ scheduleId, seats, totalAmount, schedule }` via React Router `navigate(path, { state })`. No global store is used.

**Why:** The booking summary → payment flow is a linear, session-scoped navigation. Using router state avoids adding a global store and keeps the data close to the navigation event. The `BookingPage` re-fetches the schedule from the API independently so the data is always fresh.

**Date:** 2026-04-15

---

## 19. Passenger Login Redirects to Homepage, Not Passenger Dashboard

**Decision:** After successful login, passengers are sent to `/` (homepage). Operators, admins, and super-admins are sent to their respective dashboards.

**Why:** Passengers are browsing for trips — they don't need to land on a dashboard. Sending them to the homepage lets them immediately continue searching. Staff roles land on their dashboard because their first action is always operational.

**Date:** 2026-04-15

---

## 20. Avatar Dropdown in Navbar for Authenticated Users

**Decision:** When a user is logged in, the navbar replaces the flat "Dashboard / Sign out" buttons with an avatar button (initials) that opens a dropdown containing Profile, Dashboard, and Logout. Applies to all roles.

**Why:** Cleaner UX for a multi-role app. The avatar pattern is widely recognized; it avoids cluttering the navbar with role-specific links while still providing quick access to key actions.

**Date:** 2026-04-15

---

## 21. Shared `/profile` Route for Non-Passenger Roles

**Decision:** A `/profile` route is registered under a catch-all ProtectedRoute (any authenticated user) and renders the same ProfilePage component. Passengers still have `/passenger/profile` from their layout. Admins, operators, and super-admins use `/profile`.

**Why:** Role-specific profile pages don't exist yet. Duplicating the route at `/admin/profile`, `/operator/profile`, etc. would require four layout wrappers for what is currently the same stub. A single shared route is simpler and safe to split later when profiles diverge.

**Date:** 2026-04-15

---

## 22. Dashboard Dark Mode Default

**Decision:** Dashboard layouts (Passenger, Admin, SuperAdmin, Operator) set dark mode on mount if no theme preference is stored in localStorage. If a preference exists, it is respected.

**Why:** Dashboard users are staff working for extended periods. Dark mode reduces eye strain in operational contexts. The public site defaults to light. The theme toggle in the navbar always overrides this default.

**Date:** 2026-04-15

---

## 10. Payments Are Simulated in MVP

**Decision:** The MVP payment flow is fully simulated. No live gateway (MTN MoMo, Airtel, card) is integrated.

**Why:** Live payment integrations require merchant accounts, KYC, compliance, and testing overhead that would delay the MVP significantly. A simulated flow lets the full booking UX be built and validated end-to-end before real money is involved.

**Date:** Project start
