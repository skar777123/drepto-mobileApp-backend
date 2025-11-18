import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// import { TwilioModule } from 'nestjs-twilio';
import { Nurse, NurseSchema } from '../schemas/nurse.schema';
import { NurseService } from './nurse.service';
import { NurseController } from './nurse.controller';
import { AuthModule } from '../auth/auth.module';
import { OtpModule } from '../otp/otp.module';

@Module({
  imports: [
    OtpModule,
    // TwilioModule.forRoot({
    //   accountSid: process.env.TWILIO_ACCOUNT_SID,
    //   authToken: process.env.TWILIO_AUTH_TOKEN,
    // }),
    MongooseModule.forFeature([{ name: Nurse.name, schema: NurseSchema }]),
    AuthModule,
  ],
  providers: [NurseService],
  controllers: [NurseController],
})
export class NurseModule {}
