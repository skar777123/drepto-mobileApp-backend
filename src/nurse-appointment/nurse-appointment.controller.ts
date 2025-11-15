import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NurseAppointmentService } from './nurse-appointment.service';
import { NurseAppointment } from '../schemas/nurse-appointment.schema';

@Controller('nurse-appointment')
export class NurseAppointmentController {
  constructor(private readonly nurseAppointmentService: NurseAppointmentService) {}

  @Post()
  create(@Body() createNurseAppointmentDto: Partial<NurseAppointment>) {
    return this.nurseAppointmentService.create(createNurseAppointmentDto);
  }

  @Get()
  findAll() {
    return this.nurseAppointmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.nurseAppointmentService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNurseAppointmentDto: Partial<NurseAppointment>) {
    return this.nurseAppointmentService.update(id, updateNurseAppointmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.nurseAppointmentService.remove(id);
  }
}
