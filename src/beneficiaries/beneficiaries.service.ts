import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Beneficiary, Prisma } from '@prisma/client';

@Injectable()
export class BeneficiariesService {
  constructor(private prisma: PrismaService) {}

  async findAll(userId: string): Promise<Beneficiary[]> {
    return this.prisma.beneficiary.findMany({
      where: { userId },
      include: { events: true },
    });
  }

  async findOne(id: string): Promise<Beneficiary | null> {
    return this.prisma.beneficiary.findUnique({
      where: { id },
      include: { events: true },
    });
  }

  async create(data: Prisma.BeneficiaryCreateInput): Promise<Beneficiary> {
    return this.prisma.beneficiary.create({
      data,
    });
  }

  async update(id: string, data: Prisma.BeneficiaryUpdateInput): Promise<Beneficiary> {
    return this.prisma.beneficiary.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Beneficiary> {
    return this.prisma.beneficiary.delete({
      where: { id },
    });
  }
}
