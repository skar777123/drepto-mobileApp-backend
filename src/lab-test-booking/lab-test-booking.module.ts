import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LabTestBooking, LabTestBookingSchema } from '../schemas/lab-test-booking.schema';
import { LabTestBookingService } from './lab-test-booking.service';
import { LabTestBookingController } from './lab-test-booking.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: LabTestBooking.name, schema: LabTestBookingSchema }]),
  ],
  providers: [LabTestBookingService],
  controllers: [LabTestBookingController],
})
export class LabTestBookingModule {}
