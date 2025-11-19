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
import { LabTestBookingService } from './lab-test-booking.service';
import { LabTestBooking } from '../schemas/lab-test-booking.schema';
import {
  CreateLabTestBookingDto,
  UpdateLabTestBookingDto,
} from '../dto/lab-test-booking.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('lab-test-booking')
export class LabTestBookingController {
  constructor(private readonly labTestBookingService: LabTestBookingService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createLabTestBookingDto: CreateLabTestBookingDto) {
    return this.labTestBookingService.create(createLabTestBookingDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.labTestBookingService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.labTestBookingService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLabTestBookingDto: UpdateLabTestBookingDto,
  ) {
    return this.labTestBookingService.update(id, updateLabTestBookingDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.labTestBookingService.remove(id);
  }
}
