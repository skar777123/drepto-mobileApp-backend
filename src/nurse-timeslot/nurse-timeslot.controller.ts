import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NurseTimeSlotService } from './nurse-timeslot.service';
import { NurseTimeSlot } from '../schemas/nurse-timeslot.schema';

@Controller('nurse-timeslot')
export class NurseTimeSlotController {
  constructor(private readonly nurseTimeSlotService: NurseTimeSlotService) {}

  @Post()
  create(@Body() createNurseTimeSlotDto: Partial<NurseTimeSlot>) {
    return this.nurseTimeSlotService.create(createNurseTimeSlotDto);
  }

  @Get()
  findAll() {
    return this.nurseTimeSlotService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.nurseTimeSlotService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNurseTimeSlotDto: Partial<NurseTimeSlot>) {
    return this.nurseTimeSlotService.update(id, updateNurseTimeSlotDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.nurseTimeSlotService.remove(id);
  }
}
