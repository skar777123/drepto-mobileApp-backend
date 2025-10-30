import { Inject, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { User, CreateUserDto, LoginDto } from './user.interface';
import { Cache } from '@nestjs/cache-manager';

@Injectable()
export class FirebaseService {
  private db: admin.database.Database;
  @Inject('CACHE_MANAGER') private cacheManager: Cache;
  constructor() {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert('./firebase-key.json'),
        databaseURL: 'https://drepto-backend-default-rtdb.firebaseio.com/',
      });
    }
    this.db = admin.database();
  }

  getDatabase(): admin.database.Database {
    return this.db;
  }

  async setData(path: string, data: any): Promise<void> {
    await this.db.ref(path).set(data);
  }

  async getData(path: string): Promise<any> {
    const snapshot = await this.db.ref(path).once('value');
    return snapshot.val();
  }

  async createUser(userData: CreateUserDto): Promise<User> {
    const userId = this.db.ref('users').push().key;
    if (!userId) {
      throw new Error('Failed to generate user ID');
    }

    const user: User = {
      id: userId,
      name: userData.name,
      mobileNumber: userData.mobileNumber,
      password: userData.password,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await this.db.ref(`users/${userId}`).set(user);
    return user;
  }

  
  async getUser(userId: string): Promise<User | null> {
    const snapshot = await this.db.ref(`users/${userId}`).once('value');
    return snapshot.val();
  }

  async getAllUsers(): Promise<User[]> {
    const snapshot = await this.db.ref('users').once('value');
    const users = snapshot.val();
    if (!users) return [];

    return Object.keys(users).map((key) => ({
      id: key,
      ...users[key],
    }));
  }

  async updateUser(
    userId: string,
    updates: Partial<User>,
  ): Promise<User | null> {
    const userRef = this.db.ref(`users/${userId}`);
    const snapshot = await userRef.once('value');
    const existingUser = snapshot.val();

    if (!existingUser) {
      return null;
    }

    const updatedUser = {
      ...existingUser,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await userRef.set(updatedUser);
    return updatedUser;
  }

  async deleteUser(userId: string): Promise<boolean> {
    const userRef = this.db.ref(`users/${userId}`);
    const snapshot = await userRef.once('value');
    if (!snapshot.exists()) {
      return false;
    }

    await userRef.remove();
    return true;
  }

  async loginUser(loginData: LoginDto): Promise<User | null> {
    const snapshot = await this.db.ref('users').once('value');
    const users = snapshot.val();
    if (!users) return null;

    for (const userId in users) {
      const user = users[userId];
      if (user.mobileNumber === loginData.mobileNumber && user.password === loginData.password) {
        return { id: userId, ...user };
      }
    }
    return null;
  }
}
