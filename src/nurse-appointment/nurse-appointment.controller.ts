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
import { NurseAppointmentService } from './nurse-appointment.service';
import { NurseAppointment } from '../schemas/nurse-appointment.schema';
import {
  CreateNurseAppointmentDto,
  UpdateNurseAppointmentDto,
} from '../dto/nurse-appointment.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('nurse-appointment')
export class NurseAppointmentController {
  constructor(
    private readonly nurseAppointmentService: NurseAppointmentService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createNurseAppointmentDto: CreateNurseAppointmentDto) {
    return this.nurseAppointmentService.create(createNurseAppointmentDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.nurseAppointmentService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.nurseAppointmentService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNurseAppointmentDto: UpdateNurseAppointmentDto,
  ) {
    return this.nurseAppointmentService.update(id, updateNurseAppointmentDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.nurseAppointmentService.remove(id);
  }
}
