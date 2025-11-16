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
import { AuthGuard } from '../auth/auth.guard';

@Controller('nurse-timeslot')
@UseGuards(AuthGuard)
export class NurseTimeSlotController {
  constructor(private readonly nurseTimeSlotService: NurseTimeSlotService) {}

  @Post()
  create(@Body() createNurseTimeSlotDto: CreateNurseTimeSlotDto) {
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
  update(
    @Param('id') id: string,
    @Body() updateNurseTimeSlotDto: UpdateNurseTimeSlotDto,
  ) {
    return this.nurseTimeSlotService.update(id, updateNurseTimeSlotDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.nurseTimeSlotService.remove(id);
  }
}
