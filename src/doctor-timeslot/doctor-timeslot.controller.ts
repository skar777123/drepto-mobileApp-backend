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
import { DoctorTimeSlotService } from './doctor-timeslot.service';
import { DoctorTimeSlot } from '../schemas/doctor-timeslot.schema';
import {
  CreateDoctorTimeSlotDto,
  UpdateDoctorTimeSlotDto,
} from '../dto/doctor-timeslot.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('doctor-timeslot')
@UseGuards(AuthGuard)
export class DoctorTimeSlotController {
  constructor(private readonly doctorTimeSlotService: DoctorTimeSlotService) {}

  @Post()
  create(@Body() createDoctorTimeSlotDto: CreateDoctorTimeSlotDto) {
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
  update(
    @Param('id') id: string,
    @Body() updateDoctorTimeSlotDto: UpdateDoctorTimeSlotDto,
  ) {
    return this.doctorTimeSlotService.update(id, updateDoctorTimeSlotDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doctorTimeSlotService.remove(id);
  }
}
