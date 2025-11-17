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

  @Get('Allusers')
  async getAllUsers(): Promise<User[]> {
    return this.mongoService.getAllUsers();
  }

  @Get('user/:id')
  async getUser(@Param('id') id: string): Promise<User | null> {
    return this.mongoService.getUser(id);
  }

  @Patch('user/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() updates: Partial<User>,
  ): Promise<User | null> {
    return this.mongoService.updateUser(id, updates);
  }

  @Delete('user/:id')
  async deleteUser(@Param('id') id: string): Promise<{ deleted: boolean }> {
    const deleted = await this.mongoService.deleteUser(id);
    return { deleted };
  }

  @Post('appointments')
  async bookAppointment(
    @Body() appointmentData: appointmentDto,
  ): Promise<{ appointmentId: string }> {
    const appointmentId =
      await this.mongoService.appointmentBooking(appointmentData);
    return { appointmentId };
  }

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
