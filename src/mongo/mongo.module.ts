import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoService } from './mongo.service';
import { User, UserSchema } from '../schemas/user.schema';
import { Nurse, NurseSchema } from '../schemas/nurse.schema';
import { Authorized, AuthorizedSchema } from '../schemas/authorized.schema';
import { Appointment, AppointmentSchema } from '../schemas/appointment.schema';
// import { OtpModule } from '../otp/otp.module';

@Module({
  imports: [
    // OtpModule,
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Nurse.name, schema: NurseSchema },
      { name: Authorized.name, schema: AuthorizedSchema },
      { name: Appointment.name, schema: AppointmentSchema },
    ]),
  ],
  providers: [MongoService],
  exports: [MongoService],
})
export class MongoModule { }
