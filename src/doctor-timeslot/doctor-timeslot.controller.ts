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
import { AuthGuard } from 'src/auth/auth.guard';
import { Public } from '../auth/public.decorator';

@Controller('doctor-timeslot')
export class DoctorTimeSlotController {
  constructor(private readonly doctorTimeSlotService: DoctorTimeSlotService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createDoctorTimeSlotDto: CreateDoctorTimeSlotDto) {
    return this.doctorTimeSlotService.create(createDoctorTimeSlotDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.doctorTimeSlotService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.doctorTimeSlotService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDoctorTimeSlotDto: UpdateDoctorTimeSlotDto,
  ) {
    return this.doctorTimeSlotService.update(id, updateDoctorTimeSlotDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.doctorTimeSlotService.remove(id);
  }
}
