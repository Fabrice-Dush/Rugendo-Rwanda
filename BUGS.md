# BUGS.md — Rugendo Rwanda

## What belongs here

- Confirmed bugs in implemented code.
- Known gaps between what is scaffolded and what is actually working.
- Issues discovered during testing or code review that need to be fixed.
- Do NOT log feature requests or future enhancements here — those go in `TASKS.md`.
- When a bug is fixed, move it to the RESOLVED section with the fix summary and date.

---

## Open Issues

### BUG-001 — Business logic is stubbed throughout

**Severity:** High  
**Area:** Backend — auth, routes, bookings, payments (all)  
**Description:** The backend scaffold has controllers and route files in place, but the actual business logic (database queries, validation, token handling, etc.) is entirely stubbed or missing. No endpoint currently does meaningful work.  
**Status:** Open — this is the primary focus of Phase 2.  
**Discovered:** Project scaffold review

---

### BUG-002 — Prisma schema not yet validated against business requirements

**Severity:** High  
**Area:** Database / Prisma  
**Description:** The Prisma schema was initialized as part of scaffolding but has not been reviewed against the full business requirements: role model, booking statuses, payment statuses, seat reservation, schedule relations, and booking token generation. Schema may be incomplete or have incorrect relations.  
**Status:** Open — must be resolved before the first migration is run.  
**Discovered:** Project scaffold review

---

### BUG-003 — Auth flow not verified end-to-end

**Severity:** High  
**Area:** Auth — frontend + backend  
**Description:** The auth scaffold (register, login, refresh, logout, forgot/reset password) exists on both frontend and backend but has never been tested end-to-end. Token issuance, refresh logic, password hashing, and role-based redirect have not been verified to work correctly together.  
**Status:** Open — end-to-end verification is the primary goal of Phase 2 auth work.  
**Discovered:** Project scaffold review

---

## Resolved Issues

_None yet._
