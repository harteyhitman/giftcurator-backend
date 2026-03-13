import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Event, Prisma } from '@prisma/client';

@Injectable()
export class EventsService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string): Promise<Event[]> {
    return this.prisma.event.findMany({
      where: {
        beneficiary: {
          userId,
        },
      },
      include: {
        beneficiary: true,
        gifts: true,
      },
    });
  }

  async findOne(id: string): Promise<Event | null> {
    return this.prisma.event.findUnique({
      where: { id },
      include: {
        beneficiary: true,
        gifts: true,
      },
    });
  }

  async create(data: Prisma.EventCreateInput): Promise<Event> {
    return this.prisma.event.create({
      data,
    });
  }

  async update(id: string, data: Prisma.EventUpdateInput): Promise<Event> {
    return this.prisma.event.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Event> {
    return this.prisma.event.delete({
      where: { id },
    });
  }
}
