import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NurseAppointment, NurseAppointmentSchema } from '../schemas/nurse-appointment.schema';
import { NurseAppointmentService } from './nurse-appointment.service';
import { NurseAppointmentController } from './nurse-appointment.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: NurseAppointment.name, schema: NurseAppointmentSchema }]),
  ],
  providers: [NurseAppointmentService],
  controllers: [NurseAppointmentController],
})
export class NurseAppointmentModule {}
