import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LabCenterService } from './lab-center.service';
import { LabCenter } from '../schemas/lab-center.schema';

@Controller('lab-center')
export class LabCenterController {
  constructor(private readonly labCenterService: LabCenterService) {}

  @Post()
  create(@Body() createLabCenterDto: Partial<LabCenter>) {
    return this.labCenterService.create(createLabCenterDto);
  }

  @Get()
  findAll() {
    return this.labCenterService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.labCenterService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLabCenterDto: Partial<LabCenter>) {
    return this.labCenterService.update(id, updateLabCenterDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.labCenterService.remove(id);
  }
}
