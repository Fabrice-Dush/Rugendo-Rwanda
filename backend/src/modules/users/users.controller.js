import * as usersService from './users.service.js';
import { validateUpdateProfile } from './users.validator.js';
import { success, badRequest, serverError, conflict, notFound } from '../../utils/apiResponse.js';

export async function getMe(req, res, next) {
  try {
    const user = await usersService.getUserById(req.user.id);
    return success(res, user);
  } catch (err) {
    next(err);
  }
}

export async function updateMe(req, res, next) {
  const result = validateUpdateProfile(req.body);
  if (!result.success) {
    return badRequest(res, 'Validation failed', result.error.flatten().fieldErrors);
  }

  try {
    const user = await usersService.updateUser(req.user.id, result.data);
    return success(res, user, 'Profile updated');
  } catch (err) {
    if (err.status === 409) return conflict(res, err.message);
    if (err.status === 404) return notFound(res, err.message);
    next(err);
  }
}

export async function deleteMe(req, res, next) {
  try {
    await usersService.deleteUser(req.user.id);
    return success(res, null, 'Account deleted');
  } catch (err) {
    if (err.status === 404) return notFound(res, err.message);
    next(err);
  }
}
