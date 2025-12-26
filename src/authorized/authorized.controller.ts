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
  UseGuards,
} from '@nestjs/common';
import { AuthorizedService } from './authorized.service';
import { CreateAuthorizedDto } from '../dto/authorized.dto';
import { RequestOtpDto } from '../dto/request-otp.dto';
import { VerifyOtpDto } from '../dto/verify-otp.dto';
import { Public } from '../auth/public.decorator';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('authorized')
export class AuthorizedController {
  constructor(private readonly authorizedService: AuthorizedService) { }

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
    return this.authorizedService.verifyOtp(
      Number(verifyOtpDto.mobileNumber),
      verifyOtpDto.otp,
    );
  }

  @Public()
  @Post('complete-registration/:authorizedId')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async completeRegistration(
    @Param('authorizedId') authorizedId: string,
    @Body() createAuthorizedDto: CreateAuthorizedDto,
  ) {
    const result = await this.authorizedService.completeRegistration(
      authorizedId,
      createAuthorizedDto,
    );
    return result;
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
  update(
    @Param('id') id: string,
    @Body() updateAuthorizedDto: Partial<CreateAuthorizedDto>,
  ) {
    return this.authorizedService.updateAuthorized(id, updateAuthorizedDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authorizedService.deleteAuthorized(id);
  }
}
