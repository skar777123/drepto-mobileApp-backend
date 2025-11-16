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
import { AuthGuard } from '../auth/auth.guard';

@Controller('lab-test-booking')
@UseGuards(AuthGuard)
export class LabTestBookingController {
  constructor(private readonly labTestBookingService: LabTestBookingService) {}

  @Post()
  create(@Body() createLabTestBookingDto: CreateLabTestBookingDto) {
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
  update(
    @Param('id') id: string,
    @Body() updateLabTestBookingDto: UpdateLabTestBookingDto,
  ) {
    return this.labTestBookingService.update(id, updateLabTestBookingDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.labTestBookingService.remove(id);
  }
}
