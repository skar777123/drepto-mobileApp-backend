import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  NurseTimeSlot,
  NurseTimeSlotSchema,
} from '../schemas/nurse-timeslot.schema';
import { NurseTimeSlotService } from './nurse-timeslot.service';
import { NurseTimeSlotController } from './nurse-timeslot.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NurseTimeSlot.name, schema: NurseTimeSlotSchema },
    ]),
    AuthModule,
  ],
  providers: [NurseTimeSlotService],
  controllers: [NurseTimeSlotController],
})
export class NurseTimeSlotModule {}
