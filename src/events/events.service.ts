import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
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
      orderBy: { date: 'asc' },
    });
  }

  async findOne(id: string, userId: string): Promise<Event | null> {
    return this.prisma.event.findFirst({
      where: {
        id,
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

  async create(userId: string, data: Prisma.EventCreateInput, beneficiaryId: string): Promise<Event> {
    await this.assertBeneficiaryOwnership(beneficiaryId, userId);

    return this.prisma.event.create({
      data,
    });
  }

  async update(id: string, userId: string, data: Prisma.EventUpdateInput): Promise<Event> {
    await this.assertEventOwnership(id, userId);

    return this.prisma.event.update({
      where: { id },
      data,
    });
  }

  async delete(id: string, userId: string): Promise<Event> {
    await this.assertEventOwnership(id, userId);

    return this.prisma.event.delete({
      where: { id },
    });
  }

  private async assertBeneficiaryOwnership(beneficiaryId: string, userId: string) {
    const beneficiary = await this.prisma.beneficiary.findUnique({
      where: { id: beneficiaryId },
      select: { id: true, userId: true },
    });

    if (!beneficiary) {
      throw new NotFoundException('Beneficiary not found');
    }

    if (beneficiary.userId !== userId) {
      throw new ForbiddenException('You do not have access to this beneficiary');
    }
  }

  private async assertEventOwnership(id: string, userId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        beneficiary: {
          select: { userId: true },
        },
      },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    if (event.beneficiary.userId !== userId) {
      throw new ForbiddenException('You do not have access to this event');
    }
  }
}
