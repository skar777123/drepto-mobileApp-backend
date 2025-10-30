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
} from '@nestjs/common';
import { AppService } from './app.service';
import { FirebaseService } from './firebase/firebase.service';
import type {
  CreateUserDto,
  LoginDto,
  User,
  CreateNurseDto,
  Nurse,
  CreateAuthorizedDto,
  Authorized,
} from './firebase/user.interface';
import { CacheInterceptor } from '@nestjs/cache-manager';

@UseInterceptors(CacheInterceptor)
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly firebaseService: FirebaseService,
  ) {}

  @Get('firebase-test')
  async testFirebase(): Promise<string> {
    try {
      await this.firebaseService.setData('test', {
        message: 'Firebase connected successfully!',
      });
      const data = await this.firebaseService.getData('test');
      return `Firebase Realtime Database test: ${JSON.stringify(data)}`;
    } catch (error) {
      return `Firebase connection failed: ${error.message}`;
    }
  }

  @Post('user')
  async createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.firebaseService.createUser(createUserDto);
  }

  @Post('nurse')
  async createNurse(@Body() createNurseDto: CreateNurseDto): Promise<Nurse> {
    return this.firebaseService.createNurse(createNurseDto);
  }

  @Post('authorized')
  async createAuth(
    @Body() createAuthDto: CreateAuthorizedDto,
  ): Promise<Authorized> {
    return this.firebaseService.createAuthorized(createAuthDto);
  }

  @Post('login/:role')
  async login(
    @Body() loginData: LoginDto,
    @Param('role') role: string,
  ): Promise<any> {
    if (role === 'user') {
      const user = await this.firebaseService.loginUser(loginData);
      if (!user) {
        return { success: false, message: 'Invalid credentials' };
      }
      return { success: true, user };
    }
    if (role === 'nurse') {
      const nurse = await this.firebaseService.loginNurse(loginData);
      if (!nurse) {
        return { success: false, message: 'Invalid credentials' };
      }
      return { success: true, nurse };
    }
    if (role === 'authorized') {
      const auth = await this.firebaseService.loginAuthorized(loginData);
      if (!auth) {
        return { success: false, message: 'Invalid credentials' };
      }
      return { success: true, auth };
    }
    return { success: false, message: 'Invalid role specified' };
  }

  @Get('Allusers')
  async getAllUsers(): Promise<User[]> {
    return this.firebaseService.getAllUsers();
  }

  @Get('user/:id')
  async getUser(@Param('id') id: string): Promise<User | null> {
    return this.firebaseService.getUser(id);
  }

  @Patch('user/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() updates: Partial<User>,
  ): Promise<User | null> {
    return this.firebaseService.updateUser(id, updates);
  }

  @Delete('user/:id')
  async deleteUser(@Param('id') id: string): Promise<{ deleted: boolean }> {
    const deleted = await this.firebaseService.deleteUser(id);
    return { deleted };
  }
}
