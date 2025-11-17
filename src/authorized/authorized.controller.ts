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
import { AuthorizedService } from './authorized.service';
import type { CreateAuthorizedDto, RequestOtpDto, VerifyOtpDto } from '../interfaces/user.interface';
import { AuthGuard } from '../auth/auth.guard';

@Controller('authorized')
export class AuthorizedController {
  constructor(private readonly authorizedService: AuthorizedService) {}

  @Post('request-otp')
  async requestOtp(@Body() requestOtpDto: RequestOtpDto) {
    return this.authorizedService.requestOtp(requestOtpDto.mobileNumber);
  }

  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.authorizedService.verifyOtp(Number(verifyOtpDto.mobileNumber), verifyOtpDto.otp);
  }

  @Post('complete-registration/:authorizedId')
  async completeRegistration(
    @Param('authorizedId') authorizedId: string,
    @Body() createAuthorizedDto: CreateAuthorizedDto,
  ) {
    return this.authorizedService.completeRegistration(authorizedId, createAuthorizedDto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.authorizedService.getAllAuthorized();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authorizedService.getAuthorized(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthorizedDto: Partial<CreateAuthorizedDto>) {
    return this.authorizedService.updateAuthorized(id, updateAuthorizedDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authorizedService.deleteAuthorized(id);
  }
}
