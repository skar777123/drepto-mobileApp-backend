import { Inject, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import {
  User,
  CreateUserDto,
  LoginDto,
  CreateNurseDto,
  Nurse,
  Authorized,
  CreateAuthorizedDto,
  appointmentDto,
} from './user.interface';
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
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      mobileNumber: userData.mobileNumber,
      dateOfBirth: userData.dateOfBirth,
      gender: userData.gender,
      role: userData.role,
      address: userData.address,
      medicalHistory: userData.medicalHistory,
      password: userData.password,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await this.db.ref(`users/${userId}`).set(user);
    return user;
  }

  async createNurse(nurseData: CreateNurseDto): Promise<Nurse> {
    const nurseId = this.db.ref('nurse').push().key;
    if (!nurseId) {
      throw new Error('Failed to generate nurse ID');
    }

    const nurse: Nurse = {
      id: nurseId,
      firstName: nurseData.firstName,
      lastName: nurseData.lastName,
      email: nurseData.email,
      mobileNumber: nurseData.mobileNumber,
      dateOfBirth: nurseData.dateOfBirth,
      address: nurseData.address,
      gender: nurseData.gender,
      role: nurseData.role,
      isAvailable: nurseData.isAvailable,
      licenseNumber: nurseData.licenseNumber,
      specification: nurseData.specification,
      availiability: nurseData.availiability,
      password: nurseData.password,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await this.db.ref(`nurse/${nurseId}`).set(nurse);
    return nurse;
  }

  async createAuthorized(authData: CreateAuthorizedDto): Promise<Authorized> {
    const authId = this.db.ref('authorized').push().key;
    if (!authId) {
      throw new Error('Failed to generate authorized ID');
    }

    const authorized: Authorized = {
      id: authId,
      firstName: authData.firstName,
      lastName: authData.lastName,
      email: authData.email,
      mobileNumber: authData.mobileNumber,
      gender: authData.gender,
      role: authData.role,
      dateOfBirth: authData.dateOfBirth,
      address: authData.address,
      roleTitle: authData.roleTitle,
      password: authData.password,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await this.db.ref(`authorized/${authId}`).set(authorized);
    return authorized;
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
      if (
        user.email === loginData.email &&
        user.password === loginData.password
      ) {
        return { id: userId, ...user };
      }
    }
    return null;
  }

  async loginNurse(loginData: LoginDto): Promise<Nurse | null> {
    const snapshot = await this.db.ref('nurse').once('value');
    const nurse = snapshot.val();
    if (!nurse) return null;

    for (const nurseId in nurse) {
      const nurseCheck = nurse[nurseId];
      if (
        nurseCheck.email === loginData.email &&
        nurseCheck.password === loginData.password
      ) {
        return { id: nurseId, ...nurse };
      }
    }
    return null;
  }

  async loginAuthorized(loginData: LoginDto): Promise<Authorized | null> {
    const snapshot = await this.db.ref('authorized').once('value');
    const authorized = snapshot.val();
    if (!authorized) return null;
    for (const authId in authorized) {
      const authCheck = authorized[authId];
      if (
        authCheck.email === loginData.email &&
        authCheck.password === loginData.password
      ) {
        return { id: authId, ...authorized };
      }
    }
    return null;
  }

  async getAllNurse(): Promise<Nurse | null> {
    const snapshot = await this.db.ref('nurse').once('value');
    const nurse = snapshot.val();
    if (!nurse) return null;
    return nurse;
  }

  async appointmentBooking(appointmentData: appointmentDto): Promise<string> {
    const appointmentId = this.db.ref('appointments').push().key;
    if (!appointmentId) {
      throw new Error('Failed to generate appointment ID');
    }

    const appointment = {
      ...appointmentData,
      appointmentId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await this.db.ref(`appointments/${appointmentId}`).set(appointment);
    return appointmentId;
  }

  async getUsersAppointment(userId: string): Promise<any[]> {
    const snapshot = await this.db.ref('appointments').once('value');
    const appointments = snapshot.val();
    if (!appointments) return [];

    const userAppointments = Object.keys(appointments)
      .map((key) => ({
        appointmentId: key,
        ...appointments[key],
      }))
      .filter((appointment) => appointment.userId === userId);

    return userAppointments;
  }
}
