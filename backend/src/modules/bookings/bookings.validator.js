import { z } from 'zod';

const createBookingSchema = z.object({
  scheduleId: z.number().int().positive('scheduleId must be a positive integer'),
  seats:      z.number().int().min(1).max(10, 'Maximum 10 seats per booking'),
});

export function validateCreateBooking(data) {
  return createBookingSchema.safeParse(data);
}
