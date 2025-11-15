import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DoctorTimeSlot, DoctorTimeSlotSchema } from '../schemas/doctor-timeslot.schema';
import { DoctorTimeSlotService } from './doctor-timeslot.service';
import { DoctorTimeSlotController } from './doctor-timeslot.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: DoctorTimeSlot.name, schema: DoctorTimeSlotSchema }]),
  ],
  providers: [DoctorTimeSlotService],
  controllers: [DoctorTimeSlotController],
})
export class DoctorTimeSlotModule {}
