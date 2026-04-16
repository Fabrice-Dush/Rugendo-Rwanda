# BUGS.md — Rugendo Rwanda

## What belongs here

- Confirmed bugs in implemented code.
- Known gaps between what is scaffolded and what is actually working.
- Issues discovered during testing or code review that need to be fixed.
- Do NOT log feature requests or future enhancements here — those go in `TASKS.md`.
- When a bug is fixed, move it to the RESOLVED section with the fix summary and date.

---

## Open Issues

### BUG-001 — Business logic stubbed (booking/payment/admin modules)

**Severity:** High  
**Area:** Backend — bookings, payments, boarding, operators, admin modules  
**Description:** Schedules and routes are now implemented (search, get-by-id, public listing). Booking creation, payment, boarding, admin CRUD modules still have stubbed or empty controllers.  
**Status:** Open — next focus is booking creation.  
**Discovered:** Project scaffold review

---

### BUG-004 — Migration not yet run (MySQL not running at implementation time)

**Severity:** High  
**Area:** Database  
**Description:** The Prisma schema has been updated (passwordHash nullable, phone unique, googleId, passwordResetToken fields added) but the migration has not been applied because MySQL was not running. The database schema is out of sync with the Prisma schema.  
**Status:** Open — run `npx prisma migrate dev --name init` from the backend directory once MySQL is started.  
**Discovered:** 2026-04-15

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
