import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cache } from '@nestjs/cache-manager';
import {
  User,
  CreateUserDto,
  LoginDto,
  CreateNurseDto,
  Nurse,
  Authorized,
  CreateAuthorizedDto,
  appointmentDto,
} from '../interfaces/user.interface';
import { UserDocument } from '../schemas/user.schema';
import { NurseDocument } from '../schemas/nurse.schema';
import { AuthorizedDocument } from '../schemas/authorized.schema';
import { AppointmentDocument } from '../schemas/appointment.schema';

@Injectable()
export class MongoService {
  @Inject('CACHE_MANAGER') private cacheManager: Cache;

  constructor(
    @InjectModel('User') private userModel: Model<UserDocument>,
    @InjectModel('Nurse') private nurseModel: Model<NurseDocument>,
    @InjectModel('Authorized') private authorizedModel: Model<AuthorizedDocument>,
    @InjectModel('Appointment') private appointmentModel: Model<AppointmentDocument>,
  ) {}

  // User methods
  async createUser(userData: CreateUserDto): Promise<User> {
    const user = new this.userModel(userData);
    const savedUser = await user.save();
    return {
      id: (savedUser._id as any).toString(),
      ...savedUser.toObject(),
    };
  }

  async getUser(userId: string): Promise<User | null> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) return null;
    return {
      id: (user._id as any).toString(),
      ...user.toObject(),
    };
  }

  async getAllUsers(): Promise<User[]> {
    const users = await this.userModel.find().exec();
    return users.map(user => ({
      id: (user._id as any).toString(),
      ...user.toObject(),
    }));
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User | null> {
    const user = await this.userModel.findByIdAndUpdate(userId, updates, { new: true }).exec();
    if (!user) return null;
    return {
      id: (user._id as any).toString(),
      ...user.toObject(),
    };
  }

  async deleteUser(userId: string): Promise<boolean> {
    const result = await this.userModel.findByIdAndDelete(userId).exec();
    return !!result;
  }

  async loginUser(loginData: LoginDto): Promise<User | null> {
    const user = await this.userModel.findOne({
      email: loginData.email,
      password: loginData.password,
    }).exec();
    if (!user) return null;
    return {
      id: (user._id as any).toString(),
      ...user.toObject(),
    };
  }

  // Nurse methods
  async createNurse(nurseData: CreateNurseDto): Promise<Nurse> {
    const nurse = new this.nurseModel(nurseData);
    const savedNurse = await nurse.save();
    return {
      id: (savedNurse._id as any).toString(),
      ...savedNurse.toObject(),
    };
  }

  async getAllNurse(): Promise<Nurse[]> {
    const nurses = await this.nurseModel.find().exec();
    return nurses.map(nurse => ({
      id: (nurse._id as any).toString(),
      ...nurse.toObject(),
    }));
  }

  async loginNurse(loginData: LoginDto): Promise<Nurse | null> {
    const nurse = await this.nurseModel.findOne({
      email: loginData.email,
      password: loginData.password,
    }).exec();
    if (!nurse) return null;
    return {
      id: (nurse._id as any).toString(),
      ...nurse.toObject(),
    };
  }

  // Authorized methods
  async createAuthorized(authData: CreateAuthorizedDto): Promise<Authorized> {
    const authorized = new this.authorizedModel(authData);
    const savedAuthorized = await authorized.save();
    return {
      id: (savedAuthorized._id as any).toString(),
      ...savedAuthorized.toObject(),
    };
  }

  async loginAuthorized(loginData: LoginDto): Promise<Authorized | null> {
    const authorized = await this.authorizedModel.findOne({
      email: loginData.email,
      password: loginData.password,
    }).exec();
    if (!authorized) return null;
    return {
      id: (authorized._id as any).toString(),
      ...authorized.toObject(),
    };
  }

  // Appointment methods
  async appointmentBooking(appointmentData: appointmentDto): Promise<string> {
    const appointment = new this.appointmentModel(appointmentData);
    const savedAppointment = await appointment.save();
    return (savedAppointment._id as any).toString();
  }

  async getUsersAppointment(userId: string): Promise<any[]> {
    const appointments = await this.appointmentModel.find({ userId }).exec();
    return appointments.map(appointment => ({
      appointmentId: (appointment._id as any).toString(),
      ...appointment.toObject(),
    }));
  }
}
