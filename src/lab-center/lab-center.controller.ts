import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { LabCenterService } from './lab-center.service';
import { LabCenter } from '../schemas/lab-center.schema';
import { CreateLabCenterDto, UpdateLabCenterDto } from '../dto/lab-center.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Public } from '../auth/public.decorator';

@Controller('lab-center')
export class LabCenterController {
  constructor(private readonly labCenterService: LabCenterService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createLabCenterDto: CreateLabCenterDto) {
    return this.labCenterService.create(createLabCenterDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.labCenterService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.labCenterService.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateLabCenterDto: UpdateLabCenterDto,
  ) {
    return this.labCenterService.update(id, updateLabCenterDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.labCenterService.remove(id);
  }
}
