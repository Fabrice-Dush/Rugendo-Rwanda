import prisma from '../../lib/prisma.js';
import { hashPassword, comparePassword } from '../../utils/bcrypt.utils.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt.utils.js';

export async function register({ name, email, password }) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    const err = new Error('Email already in use');
    err.status = 409;
    throw err;
  }
  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name, email, passwordHash },
    select: { id: true, name: true, email: true, role: true },
  });
  return { user };
}

export async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.isActive) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }
  const valid = await comparePassword(password, user.passwordHash);
  if (!valid) {
    const err = new Error('Invalid credentials');
    err.status = 401;
    throw err;
  }
  const payload = { id: user.id, role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  // Persist refresh token
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  await prisma.refreshToken.create({ data: { token: refreshToken, userId: user.id, expiresAt } });

  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    accessToken,
    refreshToken,
  };
}

export async function refreshTokens(token) {
  if (!token) {
    const err = new Error('Refresh token required');
    err.status = 400;
    throw err;
  }
  const payload = verifyRefreshToken(token); // throws if invalid
  const stored = await prisma.refreshToken.findUnique({ where: { token } });
  if (!stored || stored.expiresAt < new Date()) {
    const err = new Error('Refresh token invalid or expired');
    err.status = 401;
    throw err;
  }
  // Rotate: delete old, issue new
  await prisma.refreshToken.delete({ where: { token } });
  const newPayload = { id: payload.id, role: payload.role };
  const accessToken = signAccessToken(newPayload);
  const refreshToken = signRefreshToken(newPayload);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await prisma.refreshToken.create({ data: { token: refreshToken, userId: payload.id, expiresAt } });
  return { accessToken, refreshToken };
}

export async function logout(userId, token) {
  if (token) {
    await prisma.refreshToken.deleteMany({ where: { token, userId } });
  }
}
