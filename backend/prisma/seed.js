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
    { name: 'Test Passenger',  email: 'passenger@test.rw',  phone: '0781000001', role: 'PASSENGER' },
    { name: 'Test Admin',      email: 'admin@test.rw',      phone: '0781000002', role: 'ADMIN' },
    { name: 'Test SuperAdmin', email: 'superadmin@test.rw', phone: '0781000003', role: 'SUPER_ADMIN' },
    { name: 'Test Operator',   email: 'operator@test.rw',   phone: '0781000004', role: 'OPERATOR' },
    { name: 'Horizon Operator',email: 'operator2@test.rw',  phone: '0781000005', role: 'OPERATOR' },
    // Extra passengers for realistic boarding tests
    { name: 'Alice Uwimana',   email: 'alice@test.rw',      phone: '0782000001', role: 'PASSENGER' },
    { name: 'Bob Nkurunziza',  email: 'bob@test.rw',        phone: '0782000002', role: 'PASSENGER' },
    { name: 'Carol Mukamana',  email: 'carol@test.rw',      phone: '0782000003', role: 'PASSENGER' },
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

  await prisma.user.update({
    where: { email: 'operator@test.rw' },
    data:  { companyId: volcano.id },
  });
  await prisma.user.update({
    where: { email: 'operator2@test.rw' },
    data:  { companyId: horizon.id },
  });
  console.log('Assigned operators: operator@test.rw → Volcano Express, operator2@test.rw → Horizon Express');

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

  // ── Boarding and booking test data ───────────────────────────────────────────
  // Operators:
  //   operator@test.rw   → Volcano Express
  //   operator2@test.rw  → Horizon Express
  //
  // Booking matrix:
  //   RW-DEADBEEF  passenger@test.rw  Volcano  CONFIRMED+PAID  → boardable
  //   RW-A11CE001  alice@test.rw      Volcano  CONFIRMED+PAID  → boardable
  //   RW-A11CE002  alice@test.rw      Volcano  PENDING         → not boardable (not confirmed)
  //   RW-B0B00001  bob@test.rw        Volcano  CANCELLED       → not boardable
  //   RW-B0B00002  bob@test.rw        Horizon  CONFIRMED+PAID  → visible to Horizon op only; 403 for Volcano op
  //   RW-CA01CA01  carol@test.rw      Volcano  COMPLETED       → already boarded
  //   RW-PEND0001  carol@test.rw      Horizon  PENDING         → visible in Horizon company bookings

  const pax     = await prisma.user.findUnique({ where: { email: 'passenger@test.rw' } });
  const alice   = await prisma.user.findUnique({ where: { email: 'alice@test.rw' } });
  const bob     = await prisma.user.findUnique({ where: { email: 'bob@test.rw' } });
  const carol   = await prisma.user.findUnique({ where: { email: 'carol@test.rw' } });
  const volOp   = await prisma.user.findUnique({ where: { email: 'operator@test.rw' } });

  const volSched = await prisma.schedule.findFirst({
    where: { companyId: volcano.id, departureTime: { gt: new Date() }, seatsAvailable: { gt: 0 } },
    orderBy: { departureTime: 'asc' },
  });
  const horSched = await prisma.schedule.findFirst({
    where: { companyId: horizon.id, departureTime: { gt: new Date() }, seatsAvailable: { gt: 0 } },
    orderBy: { departureTime: 'asc' },
  });

  if (!volSched || !horSched) {
    console.warn('Skipped boarding bookings: could not find required schedules.');
  } else {
    async function seedBooking(ref, userId, scheduleId, status, paymentStatus, txId, extraData = {}) {
      const b = await prisma.booking.upsert({
        where:  { reference: ref },
        update: {},
        create: {
          reference:   ref,
          userId,
          scheduleId,
          seatsBooked: 1,
          totalAmount: 3000,
          status,
          ...extraData,
        },
      });
      if (paymentStatus) {
        await prisma.payment.upsert({
          where:  { bookingId: b.id },
          update: {},
          create: {
            bookingId:     b.id,
            amount:        3000,
            status:        paymentStatus,
            method:        'simulated',
            transactionId: txId,
            paidAt:        paymentStatus === 'PAID' ? new Date() : null,
          },
        });
      }
      return b;
    }

    // RW-DEADBEEF: original test booking (passenger → Volcano, CONFIRMED+PAID)
    await seedBooking('RW-DEADBEEF', pax.id,   volSched.id, 'CONFIRMED', 'PAID', 'SEED-001');
    console.log('Seeded RW-DEADBEEF  — passenger, Volcano, CONFIRMED+PAID (boardable)');

    // RW-A11CE001: Alice → Volcano, CONFIRMED+PAID (boardable via phone 0782000001 or email alice@test.rw)
    await seedBooking('RW-A11CE001', alice.id, volSched.id, 'CONFIRMED', 'PAID', 'SEED-002');
    console.log('Seeded RW-A11CE001  — alice, Volcano, CONFIRMED+PAID (boardable)');

    // RW-A11CE002: Alice → Volcano, PENDING (not boardable)
    await seedBooking('RW-A11CE002', alice.id, volSched.id, 'PENDING',   'PENDING', 'SEED-003');
    console.log('Seeded RW-A11CE002  — alice, Volcano, PENDING (not boardable)');

    // RW-B0B00001: Bob → Volcano, CANCELLED
    await seedBooking('RW-B0B00001', bob.id,  volSched.id, 'CANCELLED', null, null);
    console.log('Seeded RW-B0B00001  — bob, Volcano, CANCELLED');

    // RW-B0B00002: Bob → Horizon, CONFIRMED+PAID (FORBIDDEN for Volcano operator)
    await seedBooking('RW-B0B00002', bob.id,  horSched.id, 'CONFIRMED', 'PAID', 'SEED-005');
    console.log('Seeded RW-B0B00002  — bob, Horizon, CONFIRMED+PAID (forbidden for Volcano operator)');

    // RW-CA01CA01: Carol → Volcano, already COMPLETED (boarded by volOp)
    await seedBooking('RW-CA01CA01', carol.id, volSched.id, 'COMPLETED', 'PAID', 'SEED-006', {
      boardedAt:    new Date(Date.now() - 30 * 60 * 1000),
      boardedById:  volOp.id,
      boardingNote: 'Boarded at departure gate.',
    });
    console.log('Seeded RW-CA01CA01  — carol, Volcano, COMPLETED (already boarded)');

    // RW-PEND0001: Carol → Horizon, PENDING (visible in Horizon company bookings; not boardable)
    await seedBooking('RW-PEND0001', carol.id, horSched.id, 'PENDING', 'PENDING', 'SEED-007');
    console.log('Seeded RW-PEND0001  — carol, Horizon, PENDING (company bookings visibility test)');
  }

  console.log('\n── Test accounts ─────────────────────────────────────────────────────');
  console.log('  passenger@test.rw  / Password123  → passenger');
  console.log('  admin@test.rw      / Password123  → admin');
  console.log('  superadmin@test.rw / Password123  → super-admin');
  console.log('  operator@test.rw   / Password123  → Volcano Express operator');
  console.log('  operator2@test.rw  / Password123  → Horizon Express operator');
  console.log('  alice@test.rw      / Password123  → passenger (phone 0782000001)');
  console.log('  bob@test.rw        / Password123  → passenger (phone 0782000002)');
  console.log('  carol@test.rw      / Password123  → passenger (phone 0782000003)');

  console.log('\n── Booking references ─────────────────────────────────────────────────');
  console.log('  RW-DEADBEEF  passenger@test.rw  Volcano  CONFIRMED+PAID  → boardable');
  console.log('  RW-A11CE001  alice@test.rw      Volcano  CONFIRMED+PAID  → boardable');
  console.log('  RW-A11CE002  alice@test.rw      Volcano  PENDING         → not boardable');
  console.log('  RW-B0B00001  bob@test.rw        Volcano  CANCELLED       → not boardable');
  console.log('  RW-B0B00002  bob@test.rw        Horizon  CONFIRMED+PAID  → Horizon op only (403 for Volcano)');
  console.log('  RW-CA01CA01  carol@test.rw      Volcano  COMPLETED       → already boarded');
  console.log('  RW-PEND0001  carol@test.rw      Horizon  PENDING         → Horizon company bookings');

  console.log('\n── Boarding lookup (reference only) ───────────────────────────────────');
  console.log('  GET /api/boarding/lookup?query=RW-A11CE001   (Volcano op — found)');
  console.log('  GET /api/boarding/lookup?query=RW-B0B00002   (Volcano op — 403)');
  console.log('  GET /api/boarding/lookup?query=RW-B0B00002   (Horizon op — found)');

  console.log('\n── Operator company bookings ──────────────────────────────────────────');
  console.log('  GET /api/bookings/operator-company  (as operator@test.rw)  → Volcano bookings');
  console.log('  GET /api/bookings/operator-company  (as operator2@test.rw) → Horizon bookings');

  console.log(`\n── Schedule search ────────────────────────────────────────────────────`);
  console.log(`  GET /api/schedules/search?from=Kigali&to=Musanze&date=${D0}&seats=1`);
  console.log(`  GET /api/schedules/search?from=Kigali&to=Musanze&date=${D1}&seats=1`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
