import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NurseTimeSlot, NurseTimeSlotSchema } from '../schemas/nurse-timeslot.schema';
import { NurseTimeSlotService } from './nurse-timeslot.service';
import { NurseTimeSlotController } from './nurse-timeslot.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: NurseTimeSlot.name, schema: NurseTimeSlotSchema }]),
  ],
  providers: [NurseTimeSlotService],
  controllers: [NurseTimeSlotController],
})
export class NurseTimeSlotModule {}
