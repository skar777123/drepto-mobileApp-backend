import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DoctorAppointment, DoctorAppointmentSchema } from '../schemas/doctor-appointment.schema';
import { DoctorAppointmentService } from './doctor-appointment.service';
import { DoctorAppointmentController } from './doctor-appointment.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: DoctorAppointment.name, schema: DoctorAppointmentSchema }]),
  ],
  providers: [DoctorAppointmentService],
  controllers: [DoctorAppointmentController],
})
export class DoctorAppointmentModule {}
