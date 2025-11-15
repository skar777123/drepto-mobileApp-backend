import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongoModule } from './mongo/mongo.module';
import { AuthModule } from './auth/auth.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { DoctorModule } from './doctor/doctor.module';
import { DoctorTimeSlotModule } from './doctor-timeslot/doctor-timeslot.module';
import { DoctorAppointmentModule } from './doctor-appointment/doctor-appointment.module';
import { NurseModule } from './nurse/nurse.module';
import { NurseTimeSlotModule } from './nurse-timeslot/nurse-timeslot.module';
import { NurseAppointmentModule } from './nurse-appointment/nurse-appointment.module';
import { LabCenterModule } from './lab-center/lab-center.module';
import { LabSlotModule } from './lab-slot/lab-slot.module';
import { LabTestBookingModule } from './lab-test-booking/lab-test-booking.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/drepto',
    ),
    MongoModule,
    AuthModule,
    CacheModule.register({
      isGlobal: true,
      ttl: 120 * 10000,
      store: redisStore,
    }),
    DoctorModule,
    DoctorTimeSlotModule,
    DoctorAppointmentModule,
    NurseModule,
    NurseTimeSlotModule,
    NurseAppointmentModule,
    LabCenterModule,
    LabSlotModule,
    LabTestBookingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
