import { searchSchedules, getScheduleById } from './schedules.service.js';

export async function handleSearchSchedules(req, res) {
  try {
    const { from, to, date, seats } = req.validated;
    const schedules = await searchSchedules({ from, to, date, seats });
    return res.json({ success: true, data: schedules });
  } catch (err) {
    console.error('searchSchedules error:', err);
    return res.status(500).json({ success: false, message: 'Failed to search schedules' });
  }
}

export async function handleGetScheduleById(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid schedule ID' });
    }
    const schedule = await getScheduleById(id);
    if (!schedule) {
      return res.status(404).json({ success: false, message: 'Schedule not found' });
    }
    return res.json({ success: true, data: schedule });
  } catch (err) {
    console.error('getScheduleById error:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch schedule' });
  }
}
