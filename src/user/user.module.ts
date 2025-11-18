import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// import { TwilioModule } from 'nestjs-twilio';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User, UserSchema } from '../schemas/user.schema';
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
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
