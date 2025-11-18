import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// import { TwilioModule } from 'nestjs-twilio';
import { AuthorizedController } from './authorized.controller';
import { AuthorizedService } from './authorized.service';
import { Authorized, AuthorizedSchema } from '../schemas/authorized.schema';
import { OtpModule } from '../otp/otp.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    OtpModule,
    AuthModule,
    // TwilioModule.forRoot({
    //   accountSid: process.env.TWILIO_ACCOUNT_SID,
    //   authToken: process.env.TWILIO_AUTH_TOKEN,
    // }),
    MongooseModule.forFeature([{ name: Authorized.name, schema: AuthorizedSchema }]),
  ],
  controllers: [AuthorizedController],
  providers: [AuthorizedService],
  exports: [AuthorizedService],
})
export class AuthorizedModule {}
