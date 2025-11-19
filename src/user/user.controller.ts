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
import { UserService } from './user.service';
import type { CreateUserDto, RequestOtpDto, VerifyOtpDto } from '../interfaces/user.interface';
import { Public } from '../auth/public.decorator';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Post('request-otp')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async requestOtp(@Body() requestOtpDto: RequestOtpDto) {
    return this.userService.requestOtp(requestOtpDto.mobileNumber);
  }

  @Public()
  @Post('verify-otp')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.userService.verifyOtp(Number(verifyOtpDto.mobileNumber), verifyOtpDto.otp);
  }

  @Public()
  @Post('complete-registration/:userId')
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async completeRegistration(
    @Param('userId') userId: string,
    @Body() createUserDto: CreateUserDto,
  ) {
    const result = await this.userService.completeRegistration(userId, createUserDto);
    return result;
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.userService.getAllUsers();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.getUser(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: Partial<CreateUserDto>) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }
}
