import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, UseGuards } from '@nestjs/common';

import { CurrentUser } from '../auth/current-user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@UseGuards(JwtAuthGuard)
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  findAll(@CurrentUser() user: { id: string }) {
    return this.eventsService.findAll(user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    const event = await this.eventsService.findOne(id, user.id);

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }

  @Post()
  create(@Body() body: CreateEventDto, @CurrentUser() user: { id: string }) {
    return this.eventsService.create(user.id, {
      title: body.title,
      type: body.type,
      date: new Date(body.date),
      beneficiary: { connect: { id: body.beneficiaryId } },
    }, body.beneficiaryId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() body: UpdateEventDto,
    @CurrentUser() user: { id: string },
  ) {
    return this.eventsService.update(id, user.id, {
      title: body.title,
      type: body.type,
      date: body.date ? new Date(body.date) : undefined,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: { id: string }) {
    return this.eventsService.delete(id, user.id);
  }
}
