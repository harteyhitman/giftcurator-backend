import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { EventsService } from './events.service';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  findAll(@Query('userId') userId: string) {
    return this.eventsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Post()
  create(@Body() body: any) {
    const { beneficiaryId, ...rest } = body;
    return this.eventsService.create({
      ...rest,
      beneficiary: { connect: { id: beneficiaryId } },
    });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.eventsService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventsService.delete(id);
  }
}
