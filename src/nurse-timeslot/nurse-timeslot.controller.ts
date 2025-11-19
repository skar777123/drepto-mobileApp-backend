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
import { NurseTimeSlotService } from './nurse-timeslot.service';
import { NurseTimeSlot } from '../schemas/nurse-timeslot.schema';
import {
  CreateNurseTimeSlotDto,
  UpdateNurseTimeSlotDto,
} from '../dto/nurse-timeslot.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('nurse-timeslot')
export class NurseTimeSlotController {
  constructor(private readonly nurseTimeSlotService: NurseTimeSlotService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createNurseTimeSlotDto: CreateNurseTimeSlotDto) {
    return this.nurseTimeSlotService.create(createNurseTimeSlotDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.nurseTimeSlotService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.nurseTimeSlotService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateNurseTimeSlotDto: UpdateNurseTimeSlotDto,
  ) {
    return this.nurseTimeSlotService.update(id, updateNurseTimeSlotDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.nurseTimeSlotService.remove(id);
  }
}
