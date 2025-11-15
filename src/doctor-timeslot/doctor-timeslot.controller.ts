import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DoctorTimeSlotService } from './doctor-timeslot.service';
import { DoctorTimeSlot } from '../schemas/doctor-timeslot.schema';

@Controller('doctor-timeslot')
export class DoctorTimeSlotController {
  constructor(private readonly doctorTimeSlotService: DoctorTimeSlotService) {}

  @Post()
  create(@Body() createDoctorTimeSlotDto: Partial<DoctorTimeSlot>) {
    return this.doctorTimeSlotService.create(createDoctorTimeSlotDto);
  }

  @Get()
  findAll() {
    return this.doctorTimeSlotService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doctorTimeSlotService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDoctorTimeSlotDto: Partial<DoctorTimeSlot>) {
    return this.doctorTimeSlotService.update(id, updateDoctorTimeSlotDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doctorTimeSlotService.remove(id);
  }
}
