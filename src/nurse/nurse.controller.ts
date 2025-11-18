import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { NurseService } from './nurse.service';
import { Nurse } from '../schemas/nurse.schema';
import { CreateNurseDto, UpdateNurseDto } from '../dto/nurse.dto';
import type { RequestOtpDto, VerifyOtpDto } from '../interfaces/user.interface';
import { Public } from '../auth/public.decorator';

@Controller('nurse')
export class NurseController {
  constructor(private readonly nurseService: NurseService) {}

  @Public()
  @Post('request-otp')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async requestOtp(@Body() requestOtpDto: RequestOtpDto) {
    return this.nurseService.requestOtp(requestOtpDto.mobileNumber);
  }

  @Public()
  @Post('verify-otp')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.nurseService.verifyOtp(Number(verifyOtpDto.mobileNumber), verifyOtpDto.otp);
  }

  @Public()
  @Post('complete-registration/:nurseId')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async completeRegistration(
    @Param('nurseId') nurseId: string,
    @Body() createNurseDto: CreateNurseDto,
  ) {
    return this.nurseService.completeRegistration(nurseId, createNurseDto);
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  create(@Body() createNurseDto: CreateNurseDto) {
    return this.nurseService.create(createNurseDto);
  }

  @Get()
  findAll() {
    return this.nurseService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.nurseService.findOne(id);
  }

  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  update(@Param('id') id: string, @Body() updateNurseDto: UpdateNurseDto) {
    return this.nurseService.update(id, updateNurseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.nurseService.remove(id);
  }
}
