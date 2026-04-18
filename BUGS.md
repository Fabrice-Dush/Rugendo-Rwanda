# BUGS.md — Rugendo Rwanda

## What belongs here

- Confirmed bugs in implemented code.
- Known gaps between what is scaffolded and what is actually working.
- Issues discovered during testing or code review that need to be fixed.
- Do NOT log feature requests or future enhancements here — those go in `TASKS.md`.
- When a bug is fixed, move it to the RESOLVED section with the fix summary and date.

---

## Open Issues

### BUG-009 — Forgot-password never sent email (console-only stub)

**Severity:** High
**Area:** Backend — auth.service.js / mail
**Description:** `forgotPassword` generated a reset token and logged it to the console in development only. No email was ever sent. No `nodemailer` or SMTP utility existed.
**Fix:** Created `backend/src/utils/mail.utils.js` with a Nodemailer Gmail SMTP transporter. Updated `auth.service.js` to call `sendPasswordResetEmail`. Added `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `FRONTEND_URL` env vars to `env.js`, `.env`, and `.env.example`. Updated DECISIONS.md (decision #35). Nodemailer added as a dependency.
**Status:** Resolved — 2026-04-18

---

### BUG-001 — Business logic still stubbed in admin modules

**Severity:** High  
**Area:** Backend — admin CRUD and dashboard modules  
**Description:** Auth, booking, payment, and boarding flows are now implemented. Several admin-facing CRUD and dashboard modules still contain stub responses or placeholder controllers.  
**Status:** Open — next focus is admin CRUD coverage.  
**Discovered:** Project scaffold review

---

### BUG-004 — Migration not yet run (MySQL not running at implementation time)

**Severity:** High  
**Area:** Database  
**Description:** The Prisma schema has been updated (passwordHash nullable, phone unique, googleId, passwordResetToken fields added) but the migration has not been applied because MySQL was not running. The database schema is out of sync with the Prisma schema.  
**Status:** Open — run `npx prisma migrate dev --name init` from the backend directory once MySQL is started.  
**Discovered:** 2026-04-15

---

---

### BUG-007 — Boarding scope enforcement used stale JWT role

**Severity:** Low  
**Area:** Backend — boarding.service.js  
**Description:** `enforceBoardingScope` checked `actor.role` (JWT payload) instead of `actorUser.role` (fresh DB value). If a user's role was changed in the DB after token issuance, the company-scope check could be applied to a now-ADMIN user or bypassed for a now-OPERATOR user.  
**Fix:** Changed check to `actorUser.role !== 'OPERATOR'`. Single-line fix in `boarding.service.js`.  
**Status:** Resolved — 2026-04-17

---

### BUG-008 — Phone/email boarding search added in error (removed)

**Severity:** Medium  
**Area:** Backend — boarding.service.js, boarding.validator.js; Frontend — BoardingValidation.jsx, translations.js  
**Description:** A previous batch added phone and email as valid inputs for `GET /api/boarding/lookup`. This was not part of the agreed product flow (token/reference-only boarding). It also leaked passenger contact details through a search endpoint that should only accept a known reference.  
**Fix:** Removed `searchBoardingBookings`, reverted `lookupBoardingSchema` to enforce `RW-XXXXXXXX` format, updated UI translations in all 3 languages to reference-only text.  
**Status:** Resolved — 2026-04-17

---

## Resolved Issues

### BUG-005 — Booking after departure not blocked

**Fix:** Added `now >= departureTime` check in `bookings.service.js` after schedule is loaded. Throws `DEPARTED` error code; controller returns 400. `BookingPage.jsx` computes `hasDeparted` flag, disables the confirm button, and shows an amber warning before the user even attempts the request.  
**Resolved:** 2026-04-16

---

### BUG-006 — Account deletion: post-deletion navigation blocked if logout fails

**Fix:** Separated the `deleteAccount()` call from the `logout()` call in `ProfilePage.jsx`. If `logout()` throws after a successful account deletion, the error is silently caught and the user is still redirected to `/`. The account was already deleted and `authService.logout`'s `finally` block already cleared localStorage.  
**Resolved:** 2026-04-16

---

### BUG-002 — Prisma schema not validated against business requirements

**Fix:** Schema reviewed and refined: passwordHash made nullable (Google auth), phone made unique (login by phone), googleId field added, passwordResetToken + passwordResetExpiresAt fields added. All enums, relations, statuses confirmed correct.  
**Resolved:** 2026-04-15

---

### BUG-003 — Auth flow not verified end-to-end

**Fix:** Full auth implementation completed: register (with Rwanda phone validation), login by email or phone, refresh token rotation, logout, forgot/reset password, Google auth, /api/me. Frontend connected with AuthContext, role normalization, and Google sign-in buttons.  
**Status:** Implemented. Manual testing still needed once MySQL migration is applied.  
**Resolved (pending migration):** 2026-04-15
