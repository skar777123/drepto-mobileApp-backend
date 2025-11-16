import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  NurseAppointment,
  NurseAppointmentSchema,
} from '../schemas/nurse-appointment.schema';
import { NurseAppointmentService } from './nurse-appointment.service';
import { NurseAppointmentController } from './nurse-appointment.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: NurseAppointment.name, schema: NurseAppointmentSchema },
    ]),
    AuthModule,
  ],
  providers: [NurseAppointmentService],
  controllers: [NurseAppointmentController],
})
export class NurseAppointmentModule {}
