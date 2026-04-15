/**
 * Seed script — creates test users for all roles + sample operational data
 * for testing the schedule search flow.
 *
 * Run: node prisma/seed.js  (from the backend directory)
 *
 * Passwords: all test accounts use 'Password123' (never use in production).
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const HASH = await bcrypt.hash('Password123', 12);

// ── Helper: build a UTC DateTime for a given date string + HH:MM time ──────────
function dt(dateStr, time) {
  return new Date(`${dateStr}T${time}:00.000Z`);
}

// Use dates 2 days from now so they're always "future" when testing
const TODAY = new Date();
const pad = (n) => String(n).padStart(2, '0');
const fmtDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const D0 = fmtDate(TODAY);                                      // today
const D1 = fmtDate(new Date(TODAY.getTime() + 2 * 86400000));  // +2 days
const D2 = fmtDate(new Date(TODAY.getTime() + 3 * 86400000));  // +3 days
const D3 = fmtDate(new Date(TODAY.getTime() + 4 * 86400000));  // +4 days

async function main() {
  // ── Users ────────────────────────────────────────────────────────────────────
  const userDefs = [
    { name: 'Test Passenger', email: 'passenger@test.rw', phone: '0781000001', role: 'PASSENGER' },
    { name: 'Test Admin',     email: 'admin@test.rw',     phone: '0781000002', role: 'ADMIN' },
    { name: 'Test SuperAdmin',email: 'superadmin@test.rw',phone: '0781000003', role: 'SUPER_ADMIN' },
    { name: 'Test Operator',  email: 'operator@test.rw',  phone: '0781000004', role: 'OPERATOR' },
  ];

  for (const u of userDefs) {
    await prisma.user.upsert({
      where:  { email: u.email },
      update: {},
      create: { ...u, passwordHash: HASH },
    });
    console.log(`Seeded user: ${u.role} — ${u.email}`);
  }

  // ── Companies ────────────────────────────────────────────────────────────────
  const volcano = await prisma.company.upsert({
    where:  { name: 'Volcano Express' },
    update: {},
    create: { name: 'Volcano Express', licenseNo: 'RW-BUS-001', isActive: true },
  });
  const horizon = await prisma.company.upsert({
    where:  { name: 'Horizon Express' },
    update: {},
    create: { name: 'Horizon Express', licenseNo: 'RW-BUS-002', isActive: true },
  });
  console.log('Seeded companies: Volcano Express, Horizon Express');

  // ── Buses ────────────────────────────────────────────────────────────────────
  const bus1 = await prisma.bus.upsert({
    where:  { plateNumber: 'RAA 001 A' },
    update: {},
    create: { companyId: volcano.id, plateNumber: 'RAA 001 A', model: 'Yutong Coach', capacity: 45, status: 'ACTIVE' },
  });
  const bus2 = await prisma.bus.upsert({
    where:  { plateNumber: 'RAB 002 B' },
    update: {},
    create: { companyId: volcano.id, plateNumber: 'RAB 002 B', model: 'King Long', capacity: 49, status: 'ACTIVE' },
  });
  const bus3 = await prisma.bus.upsert({
    where:  { plateNumber: 'RAC 003 C' },
    update: {},
    create: { companyId: horizon.id, plateNumber: 'RAC 003 C', model: 'Higer Coach', capacity: 45, status: 'ACTIVE' },
  });
  const bus4 = await prisma.bus.upsert({
    where:  { plateNumber: 'RAD 004 D' },
    update: {},
    create: { companyId: horizon.id, plateNumber: 'RAD 004 D', model: 'Yutong Coach', capacity: 49, status: 'ACTIVE' },
  });
  console.log('Seeded 4 buses');

  // ── Drivers ──────────────────────────────────────────────────────────────────
  const driver1 = await prisma.driver.upsert({
    where:  { licenseNo: 'DL-RW-10001' },
    update: {},
    create: { companyId: volcano.id, name: 'Jean Bosco Nkusi', licenseNo: 'DL-RW-10001', phone: '0788100001', isActive: true },
  });
  const driver2 = await prisma.driver.upsert({
    where:  { licenseNo: 'DL-RW-10002' },
    update: {},
    create: { companyId: volcano.id, name: 'Patrick Habyarimana', licenseNo: 'DL-RW-10002', phone: '0788100002', isActive: true },
  });
  const driver3 = await prisma.driver.upsert({
    where:  { licenseNo: 'DL-RW-10003' },
    update: {},
    create: { companyId: horizon.id, name: 'Emmanuel Uwimana', licenseNo: 'DL-RW-10003', phone: '0788100003', isActive: true },
  });
  const driver4 = await prisma.driver.upsert({
    where:  { licenseNo: 'DL-RW-10004' },
    update: {},
    create: { companyId: horizon.id, name: 'Celestin Bizimana', licenseNo: 'DL-RW-10004', phone: '0788100004', isActive: true },
  });
  console.log('Seeded 4 drivers');

  // ── Routes ────────────────────────────────────────────────────────────────────
  const routeDefs = [
    { origin: 'Kigali', destination: 'Musanze',   distanceKm: 111, durationMin: 120 },
    { origin: 'Kigali', destination: 'Butare',    distanceKm: 136, durationMin: 150 },
    { origin: 'Kigali', destination: 'Gisenyi',   distanceKm: 157, durationMin: 165 },
    { origin: 'Kigali', destination: 'Cyangugu',  distanceKm: 218, durationMin: 210 },
    { origin: 'Kigali', destination: 'Kibungo',   distanceKm: 114, durationMin: 120 },
    { origin: 'Butare',  destination: 'Musanze',  distanceKm: 195, durationMin: 195 },
  ];

  const routes = {};
  for (const r of routeDefs) {
    const route = await prisma.route.upsert({
      where:  { origin_destination: { origin: r.origin, destination: r.destination } },
      update: {},
      create: { ...r, isActive: true },
    });
    routes[`${r.origin}→${r.destination}`] = route;
    console.log(`Seeded route: ${r.origin} → ${r.destination}`);
  }

  // ── Schedules ─────────────────────────────────────────────────────────────────
  // Helper to create a schedule safely (skip if conflicting unique constraints)
  async function seedSchedule(data) {
    try {
      await prisma.schedule.create({ data });
    } catch (e) {
      if (e.code !== 'P2002') throw e;
      // Duplicate — already seeded, skip
    }
  }

  const kigMusanze = routes['Kigali→Musanze'];
  const kigButare  = routes['Kigali→Butare'];
  const kigGisenyi = routes['Kigali→Gisenyi'];

  // Kigali → Musanze on D0 (today — ensures default-date searches return results)
  await seedSchedule({ routeId: kigMusanze.id, busId: bus1.id, driverId: driver1.id, companyId: volcano.id, departureTime: dt(D0, '08:00'), arrivalTime: dt(D0, '10:00'), price: 3000, seatsTotal: 45, seatsAvailable: 30, status: 'SCHEDULED' });
  await seedSchedule({ routeId: kigMusanze.id, busId: bus3.id, driverId: driver3.id, companyId: horizon.id, departureTime: dt(D0, '13:00'), arrivalTime: dt(D0, '15:00'), price: 2500, seatsTotal: 45, seatsAvailable: 20, status: 'SCHEDULED' });

  // Kigali → Butare on D0 (today)
  await seedSchedule({ routeId: kigButare.id, busId: bus2.id, driverId: driver2.id, companyId: volcano.id, departureTime: dt(D0, '07:00'), arrivalTime: dt(D0, '09:30'), price: 3500, seatsTotal: 49, seatsAvailable: 40, status: 'SCHEDULED' });

  // Kigali → Musanze on D1 (Volcano Express)
  await seedSchedule({ routeId: kigMusanze.id, busId: bus1.id, driverId: driver1.id, companyId: volcano.id, departureTime: dt(D1, '06:00'), arrivalTime: dt(D1, '08:00'), price: 3000, seatsTotal: 45, seatsAvailable: 32, status: 'SCHEDULED' });
  await seedSchedule({ routeId: kigMusanze.id, busId: bus2.id, driverId: driver2.id, companyId: volcano.id, departureTime: dt(D1, '10:00'), arrivalTime: dt(D1, '12:00'), price: 3000, seatsTotal: 49, seatsAvailable: 18, status: 'SCHEDULED' });
  await seedSchedule({ routeId: kigMusanze.id, busId: bus2.id, driverId: driver2.id, companyId: volcano.id, departureTime: dt(D1, '15:00'), arrivalTime: dt(D1, '17:00'), price: 3000, seatsTotal: 49, seatsAvailable: 0,  status: 'SCHEDULED' });

  // Kigali → Musanze on D1 (Horizon Express)
  await seedSchedule({ routeId: kigMusanze.id, busId: bus3.id, driverId: driver3.id, companyId: horizon.id, departureTime: dt(D1, '08:30'), arrivalTime: dt(D1, '10:30'), price: 2500, seatsTotal: 45, seatsAvailable: 24, status: 'SCHEDULED' });
  await seedSchedule({ routeId: kigMusanze.id, busId: bus4.id, driverId: driver4.id, companyId: horizon.id, departureTime: dt(D1, '14:00'), arrivalTime: dt(D1, '16:00'), price: 2500, seatsTotal: 49, seatsAvailable: 6,  status: 'SCHEDULED' });

  // Kigali → Musanze on D2 (both companies)
  await seedSchedule({ routeId: kigMusanze.id, busId: bus1.id, driverId: driver1.id, companyId: volcano.id, departureTime: dt(D2, '06:00'), arrivalTime: dt(D2, '08:00'), price: 3000, seatsTotal: 45, seatsAvailable: 40, status: 'SCHEDULED' });
  await seedSchedule({ routeId: kigMusanze.id, busId: bus3.id, driverId: driver3.id, companyId: horizon.id, departureTime: dt(D2, '09:00'), arrivalTime: dt(D2, '11:00'), price: 2500, seatsTotal: 45, seatsAvailable: 30, status: 'SCHEDULED' });

  // Kigali → Butare on D1 + D2
  await seedSchedule({ routeId: kigButare.id, busId: bus2.id, driverId: driver2.id, companyId: volcano.id, departureTime: dt(D1, '07:00'), arrivalTime: dt(D1, '09:30'), price: 3500, seatsTotal: 49, seatsAvailable: 35, status: 'SCHEDULED' });
  await seedSchedule({ routeId: kigButare.id, busId: bus4.id, driverId: driver4.id, companyId: horizon.id, departureTime: dt(D1, '13:00'), arrivalTime: dt(D1, '15:30'), price: 3200, seatsTotal: 49, seatsAvailable: 20, status: 'SCHEDULED' });
  await seedSchedule({ routeId: kigButare.id, busId: bus1.id, driverId: driver1.id, companyId: volcano.id, departureTime: dt(D2, '07:00'), arrivalTime: dt(D2, '09:30'), price: 3500, seatsTotal: 45, seatsAvailable: 42, status: 'SCHEDULED' });

  // Kigali → Gisenyi on D2 + D3
  await seedSchedule({ routeId: kigGisenyi.id, busId: bus3.id, driverId: driver3.id, companyId: horizon.id, departureTime: dt(D2, '05:30'), arrivalTime: dt(D2, '08:15'), price: 4000, seatsTotal: 45, seatsAvailable: 15, status: 'SCHEDULED' });
  await seedSchedule({ routeId: kigGisenyi.id, busId: bus1.id, driverId: driver1.id, companyId: volcano.id, departureTime: dt(D3, '06:00'), arrivalTime: dt(D3, '08:45'), price: 4200, seatsTotal: 45, seatsAvailable: 38, status: 'SCHEDULED' });

  console.log('Seeded schedules');
  console.log(`\nTest search (today):   GET /api/schedules/search?from=Kigali&to=Musanze&date=${D0}&seats=1`);
  console.log(`Test search (+2 days): GET /api/schedules/search?from=Kigali&to=Musanze&date=${D1}&seats=1`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
