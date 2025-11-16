import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { DoctorAppointmentService } from './doctor-appointment.service';
import { DoctorAppointment } from '../schemas/doctor-appointment.schema';
import {
  CreateDoctorAppointmentDto,
  UpdateDoctorAppointmentDto,
} from '../dto/doctor-appointment.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('doctor-appointment')
@UseGuards(AuthGuard)
export class DoctorAppointmentController {
  constructor(
    private readonly doctorAppointmentService: DoctorAppointmentService,
  ) {}

  @Post()
  create(@Body() createDoctorAppointmentDto: CreateDoctorAppointmentDto) {
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
  update(
    @Param('id') id: string,
    @Body() updateDoctorAppointmentDto: UpdateDoctorAppointmentDto,
  ) {
    return this.doctorAppointmentService.update(id, updateDoctorAppointmentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doctorAppointmentService.remove(id);
  }
}
