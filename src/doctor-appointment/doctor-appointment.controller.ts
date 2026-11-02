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
import { AuthGuard } from 'src/auth/auth.guard';
import { Public } from '../auth/public.decorator';

@Controller('doctor-appointment')
export class DoctorAppointmentController {
  constructor(
    private readonly doctorAppointmentService: DoctorAppointmentService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createDoctorAppointmentDto: CreateDoctorAppointmentDto) {
    return this.doctorAppointmentService.create(createDoctorAppointmentDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.doctorAppointmentService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doctorAppointmentService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDoctorAppointmentDto: UpdateDoctorAppointmentDto,
  ) {
    return this.doctorAppointmentService.update(id, updateDoctorAppointmentDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doctorAppointmentService.remove(id);
  }
}
