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
import { MetricsService } from './metrics/metrics.service';

@UseInterceptors(CacheInterceptor)
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly mongoService: MongoService,
    private readonly metricsService: MetricsService,
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

  @Post('user')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.mongoService.createUser(createUserDto);
  }

  @Post('nurse')
  async createNurse(@Body() createNurseDto: CreateNurseDto): Promise<Nurse> {
    return this.mongoService.createNurse(createNurseDto);
  }

  @Get('Allnurse')
  async getAllNurse(): Promise<Nurse[]> {
    return this.mongoService.getAllNurse();
  }

  @Post('authorized')
  async createAuth(
    @Body() createAuthDto: CreateAuthorizedDto,
  ): Promise<Authorized> {
    return this.mongoService.createAuthorized(createAuthDto);
  }

  @Post('login/:role')
  async login(
    @Body() loginData: LoginDto,
    @Param('role') role: string,
  ): Promise<any> {
    if (role === 'user') {
      const user = await this.mongoService.loginUser(loginData);
      if (!user) {
        return { success: false, message: 'Invalid credentials' };
      }
      return { success: true, user };
    }
    if (role === 'nurse') {
      const nurse = await this.mongoService.loginNurse(loginData);
      if (!nurse) {
        return { success: false, message: 'Invalid credentials' };
      }
      return { success: true, nurse };
    }
    if (role === 'authorized') {
      const auth = await this.mongoService.loginAuthorized(loginData);
      if (!auth) {
        return { success: false, message: 'Invalid credentials' };
      }
      return { success: true, auth };
    }
    return { success: false, message: 'Invalid role specified' };
  }

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
  @Header('Content-Type', 'text/plain')
  async metrics() {
    return await this.metricsService.getMetrics();
  }
}
