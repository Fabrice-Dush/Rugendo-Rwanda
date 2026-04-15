import { z } from 'zod';

// Returns today's date as YYYY-MM-DD in local (server) time
function todayLocalStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export const searchSchedulesSchema = z.object({
  from:  z.string().min(1, 'Origin is required').trim(),
  to:    z.string().min(1, 'Destination is required').trim(),
  date:  z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD')
    .refine((d) => !isNaN(Date.parse(d)), 'Invalid date')
    .optional()
    .default(() => todayLocalStr()),
  seats: z.coerce.number().int().min(1, 'At least 1 seat required').max(20).optional().default(1),
}).refine(
  (data) => data.from.trim().toLowerCase() !== data.to.trim().toLowerCase(),
  { message: 'Origin and destination cannot be the same', path: ['to'] }
);

export function validateSearchSchedules(req, res, next) {
  const result = searchSchedulesSchema.safeParse(req.query);
  if (!result.success) {
    return res.status(422).json({
      success: false,
      message: 'Validation error',
      errors: result.error.flatten().fieldErrors,
    });
  }
  req.validated = result.data;
  return next();
}
