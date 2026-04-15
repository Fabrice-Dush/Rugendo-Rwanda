import prisma from '../../lib/prisma.js';

const safeSelect = { id: true, name: true, email: true, phone: true, role: true, isActive: true, createdAt: true };

export async function getUserById(id) {
  const user = await prisma.user.findUnique({ where: { id }, select: safeSelect });
  if (!user) {
    const err = new Error('User not found');
    err.status = 404;
    throw err;
  }
  return user;
}

export async function updateUser(id, data) {
  // Only allow safe fields
  const { name, phone } = data;
  return prisma.user.update({ where: { id }, data: { name, phone }, select: safeSelect });
}
