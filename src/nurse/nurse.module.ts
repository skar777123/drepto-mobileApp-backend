import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Nurse, NurseSchema } from '../schemas/nurse.schema';
import { NurseService } from './nurse.service';
import { NurseController } from './nurse.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Nurse.name, schema: NurseSchema }]),
  ],
  providers: [NurseService],
  controllers: [NurseController],
})
export class NurseModule {}
