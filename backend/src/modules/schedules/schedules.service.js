import prisma from '../../lib/prisma.js';

const SCHEDULE_INCLUDE = {
  route:   { select: { id: true, origin: true, destination: true, distanceKm: true, durationMin: true } },
  company: { select: { id: true, name: true } },
  bus:     { select: { id: true, plateNumber: true, model: true, capacity: true } },
};

export async function searchSchedules({ from, to, date, seats }) {
  // Build day range in UTC (date param is YYYY-MM-DD)
  const startOfDay = new Date(`${date}T00:00:00.000Z`);
  const endOfDay   = new Date(`${date}T23:59:59.999Z`);

  return prisma.schedule.findMany({
    where: {
      status:         'SCHEDULED',
      seatsAvailable: { gte: seats },
      departureTime:  { gte: startOfDay, lte: endOfDay },
      route: {
        // MySQL default collation is case-insensitive, so `contains` works well here
        origin:      { contains: from },
        destination: { contains: to },
        isActive:    true,
      },
    },
    include:  SCHEDULE_INCLUDE,
    orderBy:  { departureTime: 'asc' },
  });
}

export async function getScheduleById(id) {
  return prisma.schedule.findUnique({
    where:   { id },
    include: SCHEDULE_INCLUDE,
  });
}
