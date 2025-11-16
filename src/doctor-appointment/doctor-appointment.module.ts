import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  DoctorAppointment,
  DoctorAppointmentSchema,
} from '../schemas/doctor-appointment.schema';
import { DoctorAppointmentService } from './doctor-appointment.service';
import { DoctorAppointmentController } from './doctor-appointment.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DoctorAppointment.name, schema: DoctorAppointmentSchema },
    ]),
    AuthModule,
  ],
  providers: [DoctorAppointmentService],
  controllers: [DoctorAppointmentController],
})
export class DoctorAppointmentModule {}
