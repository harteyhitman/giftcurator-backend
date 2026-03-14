import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Beneficiary, Prisma } from '@prisma/client';

@Injectable()
export class BeneficiariesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string): Promise<Beneficiary[]> {
    return this.prisma.beneficiary.findMany({
      where: { userId },
      include: { events: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string): Promise<Beneficiary | null> {
    return this.prisma.beneficiary.findFirst({
      where: { id, userId },
      include: { events: true },
    });
  }

  async create(data: Prisma.BeneficiaryCreateInput): Promise<Beneficiary> {
    return this.prisma.beneficiary.create({
      data,
    });
  }

  async update(id: string, userId: string, data: Prisma.BeneficiaryUpdateInput): Promise<Beneficiary> {
    await this.assertOwnership(id, userId);

    return this.prisma.beneficiary.update({
      where: { id },
      data,
    });
  }

  async delete(id: string, userId: string): Promise<Beneficiary> {
    await this.assertOwnership(id, userId);

    return this.prisma.beneficiary.delete({
      where: { id },
    });
  }

  private async assertOwnership(id: string, userId: string) {
    const beneficiary = await this.prisma.beneficiary.findUnique({
      where: { id },
      select: { id: true, userId: true },
    });

    if (!beneficiary) {
      throw new NotFoundException('Beneficiary not found');
    }

    if (beneficiary.userId !== userId) {
      throw new ForbiddenException('You do not have access to this beneficiary');
    }
  }
}
