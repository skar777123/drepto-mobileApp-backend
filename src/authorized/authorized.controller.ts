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
import { AuthorizedService } from './authorized.service';
import type { CreateAuthorizedDto, RequestOtpDto, VerifyOtpDto } from '../interfaces/user.interface';
import { Public } from '../auth/public.decorator';

@Controller('authorized')
export class AuthorizedController {
  constructor(private readonly authorizedService: AuthorizedService) {}

  @Public()
  @Post('request-otp')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async requestOtp(@Body() requestOtpDto: RequestOtpDto) {
    return this.authorizedService.requestOtp(requestOtpDto.mobileNumber);
  }

  @Public()
  @Post('verify-otp')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authorizedService.verifyOtp(Number(verifyOtpDto.mobileNumber), verifyOtpDto.otp);
  }

  @Public()
  @Post('complete-registration/:authorizedId')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async completeRegistration(
    @Param('authorizedId') authorizedId: string,
    @Body() createAuthorizedDto: CreateAuthorizedDto,
  ) {
    return this.authorizedService.completeRegistration(authorizedId, createAuthorizedDto);
  }

  @Get()
  findAll() {
    return this.authorizedService.getAllAuthorized();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authorizedService.getAuthorized(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthorizedDto: Partial<CreateAuthorizedDto>) {
    return this.authorizedService.updateAuthorized(id, updateAuthorizedDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authorizedService.deleteAuthorized(id);
  }
}
