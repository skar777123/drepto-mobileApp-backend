import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LabTestBookingService } from './lab-test-booking.service';
import { LabTestBooking } from '../schemas/lab-test-booking.schema';

@Controller('lab-test-booking')
export class LabTestBookingController {
  constructor(private readonly labTestBookingService: LabTestBookingService) {}

  @Post()
  create(@Body() createLabTestBookingDto: Partial<LabTestBooking>) {
    return this.labTestBookingService.create(createLabTestBookingDto);
  }

  @Get()
  findAll() {
    return this.labTestBookingService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.labTestBookingService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLabTestBookingDto: Partial<LabTestBooking>) {
    return this.labTestBookingService.update(id, updateLabTestBookingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.labTestBookingService.remove(id);
  }
}
