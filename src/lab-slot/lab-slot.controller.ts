import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LabSlotService } from './lab-slot.service';
import { LabSlot } from '../schemas/lab-slot.schema';
import { CreateLabSlotDto, UpdateLabSlotDto } from '../dto/lab-slot.dto';

@Controller('lab-slot')
export class LabSlotController {
  constructor(private readonly labSlotService: LabSlotService) {}

  @Post()
  create(@Body() createLabSlotDto: CreateLabSlotDto) {
    return this.labSlotService.create(createLabSlotDto);
  }

  @Get()
  findAll() {
    return this.labSlotService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.labSlotService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLabSlotDto: UpdateLabSlotDto) {
    return this.labSlotService.update(id, updateLabSlotDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.labSlotService.remove(id);
  }
}
