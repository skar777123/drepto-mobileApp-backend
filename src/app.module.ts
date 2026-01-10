import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongoModule } from './mongo/mongo.module';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/auth.guard';
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
import { UserModule } from './user/user.module';
import { AuthorizedModule } from './authorized/authorized.module';
import { ProductModule } from './product/product.module';
import { ContactModule } from './contact/contact.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
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
    UserModule,
    AuthorizedModule,
    DoctorModule,
    DoctorTimeSlotModule,
    DoctorAppointmentModule,
    NurseModule,
    NurseTimeSlotModule,
    NurseAppointmentModule,
    LabCenterModule,
    LabSlotModule,
    LabTestBookingModule,
    ProductModule,
    ContactModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
