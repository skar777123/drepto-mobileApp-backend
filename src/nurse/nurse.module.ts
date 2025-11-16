import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Nurse, NurseSchema } from '../schemas/nurse.schema';
import { NurseService } from './nurse.service';
import { NurseController } from './nurse.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Nurse.name, schema: NurseSchema }]),
    AuthModule,
  ],
  providers: [NurseService],
  controllers: [NurseController],
})
export class NurseModule {}
