import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LabCenter, LabCenterSchema } from '../schemas/lab-center.schema';
import { LabCenterService } from './lab-center.service';
import { LabCenterController } from './lab-center.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: LabCenter.name, schema: LabCenterSchema }]),
  ],
  providers: [LabCenterService],
  controllers: [LabCenterController],
})
export class LabCenterModule {}
