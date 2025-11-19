import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Patch,
  UseInterceptors,
  Header,
  UseGuards,
} from '@nestjs/common';
import { AppService } from './app.service';
import { MongoService } from './mongo/mongo.service';
import { AuthService } from './auth/auth.service';
import type {
  CreateUserDto,
  LoginDto,
  User,
  CreateNurseDto,
  Nurse,
  CreateAuthorizedDto,
  Authorized,
  appointmentDto,
} from './interfaces/user.interface';
import { CacheInterceptor } from '@nestjs/cache-manager';
import client from 'prom-client';
import { AuthGuard } from './auth/auth.guard';

@UseInterceptors(CacheInterceptor)
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly mongoService: MongoService,
    private readonly authService: AuthService,
  ) {}

  @Get('mongo-test')
  async testMongo(): Promise<string> {
    try {
      // Simple test to check if MongoDB connection works
      const users = await this.mongoService.getAllUsers();
      return `MongoDB connect successful`;
    } catch (error) {
      return `MongoDB connection failed: ${error.message}`;
    }
  }

  // Deprecated: Use /user/complete-registration/:userId for registration

  // Deprecated: Use /nurse/complete-registration/:nurseId for registration

  @Get('Allnurse-mongo')
  async getAllNurse(): Promise<Nurse[]> {
    return this.mongoService.getAllNurse();
  }

  // Deprecated: Use /authorized/complete-registration/:authorizedId for registration

  // Deprecated: Use role-specific /verify-otp endpoints for login

  // Deprecated: Use /nurse/verify-otp for login

  @UseGuards(AuthGuard)
  @Get('Allusers')
  async getAllUsers(): Promise<User[]> {
    return this.mongoService.getAllUsers();
  }

  @UseGuards(AuthGuard)
  @Post('appointments')
  async bookAppointment(
    @Body() appointmentData: appointmentDto,
  ): Promise<{ appointmentId: string }> {
    const appointmentId =
      await this.mongoService.appointmentBooking(appointmentData);
    return { appointmentId };
  }

  @UseGuards(AuthGuard)
  @Get('appointments/:userId')
  async getUserAppointments(@Param('userId') userId: string): Promise<any[]> {
    return this.mongoService.getUsersAppointment(userId);
  }

  @Get('/metrics')
  async metrics() {
    const metrics = await client.register.metrics();
    return metrics;
  }
}
