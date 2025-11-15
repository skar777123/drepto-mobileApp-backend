import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DoctorAppointmentService } from './doctor-appointment.service';
import { DoctorAppointment } from '../schemas/doctor-appointment.schema';

@Controller('doctor-appointment')
export class DoctorAppointmentController {
  constructor(private readonly doctorAppointmentService: DoctorAppointmentService) {}

  @Post()
  create(@Body() createDoctorAppointmentDto: Partial<DoctorAppointment>) {
    return this.doctorAppointmentService.create(createDoctorAppointmentDto);
  }

  @Get()
  findAll() {
    return this.doctorAppointmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doctorAppointmentService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDoctorAppointmentDto: Partial<DoctorAppointment>) {
    return this.doctorAppointmentService.update(id, updateDoctorAppointmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doctorAppointmentService.remove(id);
  }
}
