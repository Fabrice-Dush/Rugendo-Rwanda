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

## 10. Payments Are Simulated in MVP

**Decision:** The MVP payment flow is fully simulated. No live gateway (MTN MoMo, Airtel, card) is integrated.

**Why:** Live payment integrations require merchant accounts, KYC, compliance, and testing overhead that would delay the MVP significantly. A simulated flow lets the full booking UX be built and validated end-to-end before real money is involved.

**Date:** Project start
