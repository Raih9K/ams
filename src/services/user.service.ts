import { Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import prisma from '../config/db';

export class UserService {
  static async createUser(data: Prisma.UserCreateInput) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
      include: {
        profile: true,
      },
    });
  }

  static async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });
  }

  static async findById(id: number) {
    return prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    });
  }

  static async updateStatus(id: number, isActive: boolean) {
    return prisma.user.update({
      where: { id },
      data: { isActive },
    });
  }
}
