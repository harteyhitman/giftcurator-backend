import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BeneficiariesService } from './beneficiaries.service';

@Controller('beneficiaries')
export class BeneficiariesController {
  constructor(private readonly beneficiariesService: BeneficiariesService) {}

  @Get()
  findAll(@Query('userId') userId: string) {
    return this.beneficiariesService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.beneficiariesService.findOne(id);
  }

  @Post()
  create(@Body() body: any) {
    const { userId, ...rest } = body;
    return this.beneficiariesService.create({
      ...rest,
      user: { connect: { id: userId } },
    });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.beneficiariesService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.beneficiariesService.delete(id);
  }
}
