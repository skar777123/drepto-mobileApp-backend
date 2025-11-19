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
import { LabSlotService } from './lab-slot.service';
import { LabSlot } from '../schemas/lab-slot.schema';
import { CreateLabSlotDto, UpdateLabSlotDto } from '../dto/lab-slot.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('lab-slot')
export class LabSlotController {
  constructor(private readonly labSlotService: LabSlotService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createLabSlotDto: CreateLabSlotDto) {
    return this.labSlotService.create(createLabSlotDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.labSlotService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.labSlotService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLabSlotDto: UpdateLabSlotDto) {
    return this.labSlotService.update(id, updateLabSlotDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.labSlotService.remove(id);
  }
}
