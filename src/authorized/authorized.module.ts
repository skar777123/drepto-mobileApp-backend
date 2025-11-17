import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthorizedController } from './authorized.controller';
import { AuthorizedService } from './authorized.service';
import { Authorized, AuthorizedSchema } from '../schemas/authorized.schema';
import { OtpModule } from '../otp/otp.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    OtpModule,
    AuthModule,
    MongooseModule.forFeature([{ name: Authorized.name, schema: AuthorizedSchema }]),
  ],
  controllers: [AuthorizedController],
  providers: [AuthorizedService],
  exports: [AuthorizedService],
})
export class AuthorizedModule {}
