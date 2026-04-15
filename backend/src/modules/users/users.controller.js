import * as usersService from './users.service.js';
import { success } from '../../utils/apiResponse.js';

export async function getMe(req, res, next) {
  try {
    const user = await usersService.getUserById(req.user.id);
    return success(res, user);
  } catch (err) {
    next(err);
  }
}

export async function updateMe(req, res, next) {
  try {
    const user = await usersService.updateUser(req.user.id, req.body);
    return success(res, user, 'Profile updated');
  } catch (err) {
    next(err);
  }
}
