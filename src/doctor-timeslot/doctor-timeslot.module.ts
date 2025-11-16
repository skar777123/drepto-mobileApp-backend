import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DoctorTimeSlot,
  DoctorTimeSlotSchema,
} from '../schemas/doctor-timeslot.schema';
import { DoctorTimeSlotService } from './doctor-timeslot.service';
import { DoctorTimeSlotController } from './doctor-timeslot.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DoctorTimeSlot.name, schema: DoctorTimeSlotSchema },
    ]),
    AuthModule,
  ],
  providers: [DoctorTimeSlotService],
  controllers: [DoctorTimeSlotController],
})
export class DoctorTimeSlotModule {}
