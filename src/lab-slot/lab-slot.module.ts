import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LabSlot, LabSlotSchema } from '../schemas/lab-slot.schema';
import { LabSlotService } from './lab-slot.service';
import { LabSlotController } from './lab-slot.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: LabSlot.name, schema: LabSlotSchema }]),
    AuthModule,
  ],
  providers: [LabSlotService],
  controllers: [LabSlotController],
})
export class LabSlotModule {}
