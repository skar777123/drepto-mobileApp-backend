import { Controller, Get, Post, Put, Delete, Body, Param, Patch, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FirebaseService } from './firebase/firebase.service';
import type { CreateUserDto, User } from './firebase/user.interface';
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
      await this.firebaseService.setData('test', { message: 'Firebase connected successfully!' });
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

  @Get('users')
  async getAllUsers(): Promise<User[]> {
    return this.firebaseService.getAllUsers();
  }

  @Get('users/:id')
  async getUser(@Param('id') id: string): Promise<User | null> {
    return this.firebaseService.getUser(id);
  }

  @Patch('users/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() updates: Partial<User>,
  ): Promise<User | null> {
    return this.firebaseService.updateUser(id, updates);
  }

  @Delete('users/:id')
  async deleteUser(@Param('id') id: string): Promise<{ deleted: boolean }> {
    const deleted = await this.firebaseService.deleteUser(id);
    return { deleted };
  }
}
