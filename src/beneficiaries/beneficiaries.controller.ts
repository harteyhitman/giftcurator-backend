import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, UseGuards } from '@nestjs/common';

import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BeneficiariesService } from './beneficiaries.service';
import { CreateBeneficiaryDto } from './dto/create-beneficiary.dto';
import { UpdateBeneficiaryDto } from './dto/update-beneficiary.dto';

@UseGuards(JwtAuthGuard)
@Controller('beneficiaries')
export class BeneficiariesController {
  constructor(private readonly beneficiariesService: BeneficiariesService) {}

  @Get()
  findAll(@CurrentUser() user: { id: string }) {
    return this.beneficiariesService.findAll(user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    const beneficiary = await this.beneficiariesService.findOne(id, user.id);

    if (!beneficiary) {
      throw new NotFoundException('Beneficiary not found');
    }

    return beneficiary;
  }

  @Post()
  create(@Body() body: CreateBeneficiaryDto, @CurrentUser() user: { id: string }) {
    return this.beneficiariesService.create({
      ...body,
      dob: new Date(body.dob),
      user: { connect: { id: user.id } },
    });
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateBeneficiaryDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.beneficiariesService.update(id, user.id, {
      ...body,
      dob: body.dob ? new Date(body.dob) : undefined,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.beneficiariesService.delete(id, user.id);
  }
}
