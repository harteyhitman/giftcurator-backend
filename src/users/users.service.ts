import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, User } from '@prisma/client';

import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async getProfile(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        beneficiaries: {
          include: {
            events: true,
          },
        },
        subscriptions: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...result } = user;
    return result;
  }

  async updateProfile(id: string, data: UpdateProfileDto) {
    const currentUser = await this.findById(id);

    if (!currentUser) {
      throw new NotFoundException('User not found');
    }

    const normalizedEmail = data.email?.trim().toLowerCase();

    if (normalizedEmail && normalizedEmail !== currentUser.email) {
      const existingUser = await this.findOne(normalizedEmail);

      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Email already exists');
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        email: normalizedEmail,
        firstName: data.firstName?.trim(),
        lastName: data.lastName?.trim(),
        mobileNumber: data.mobileNumber?.trim(),
      },
      include: {
        beneficiaries: {
          include: {
            events: true,
          },
        },
        subscriptions: {
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    const { password, ...result } = updatedUser;
    return result;
  }
}
