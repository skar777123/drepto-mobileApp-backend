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
  // RequestOtpDto,
  // VerifyOtpDto,
  appointmentDto,
} from '../interfaces/user.interface';
import { UserDocument } from '../schemas/user.schema';
import { NurseDocument } from '../schemas/nurse.schema';
import { AuthorizedDocument } from '../schemas/authorized.schema';
import { AppointmentDocument } from '../schemas/appointment.schema';
// import { OtpService } from '../otp/otp.service';

@Injectable()
export class MongoService {
  @Inject('CACHE_MANAGER') private cacheManager: Cache;

  constructor(
    @InjectModel('User') private userModel: Model<UserDocument>,
    @InjectModel('Nurse') private nurseModel: Model<NurseDocument>,
    @InjectModel('Authorized')
    private authorizedModel: Model<AuthorizedDocument>,
    @InjectModel('Appointment')
    private appointmentModel: Model<AppointmentDocument>,
    // private otpService: OtpService,
  ) { }

  // User methods
  // async requestUserOtp(requestData: RequestOtpDto): Promise<{ success: boolean; message: string }> {
  //   // ... (commented out)
  //   return { success: false, message: 'OTP auth disabled' };
  // }

  // async verifyUserOtp(verifyData: VerifyOtpDto): Promise<{ success: boolean; message: string; user?: User }> {
  //   // ... (commented out)
  //   return { success: false, message: 'OTP auth disabled' };
  // }

  async completeUserRegistration(userId: string, userData: CreateUserDto): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(userId, userData, { new: true })
      .exec();
    if (!user) {
      throw new Error('User not found');
    }
    return {
      id: (user._id as any).toString(),
      ...user.toObject(),
    };
  }

  async createUser(userData: CreateUserDto): Promise<User> {
    // This method is now deprecated, use requestUserOtp and completeUserRegistration
    const existingUser = await this.userModel
      .findOne({ mobileNumber: userData.mobileNumber })
      .exec();
    if (existingUser) {
      throw new Error('User with this mobile number already exists');
    }

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
    return users.map((user) => ({
      id: (user._id as any).toString(),
      ...user.toObject(),
    }));
  }

  async updateUser(
    userId: string,
    updates: Partial<User>,
  ): Promise<User | null> {
    const user = await this.userModel
      .findByIdAndUpdate(userId, updates, { new: true })
      .exec();
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

  // async loginUser(loginData: LoginDto): Promise<User | null> {
  //   // ...
  //   return null; 
  // }

  // Nurse methods
  // async requestNurseOtp(requestData: RequestOtpDto): Promise<{ success: boolean; message: string }> {
  //   // ...
  //   return { success: false, message: 'OTP auth disabled' };
  // }

  // async verifyNurseOtp(verifyData: VerifyOtpDto): Promise<{ success: boolean; message: string; nurse?: Nurse }> {
  //   // ...
  //   return { success: false, message: 'OTP auth disabled' };
  // }

  async completeNurseRegistration(nurseId: string, nurseData: CreateNurseDto): Promise<Nurse> {
    const nurse = await this.nurseModel
      .findByIdAndUpdate(nurseId, nurseData, { new: true })
      .exec();
    if (!nurse) {
      throw new Error('Nurse not found');
    }
    return {
      id: (nurse._id as any).toString(),
      ...nurse.toObject(),
    };
  }

  async createNurse(nurseData: CreateNurseDto): Promise<Nurse> {
    // This method is now deprecated, use requestNurseOtp and completeNurseRegistration
    const existingNurse = await this.nurseModel
      .findOne({ mobileNumber: nurseData.mobileNumber })
      .exec();
    if (existingNurse) {
      throw new Error('Nurse with this mobile number already exists');
    }

    const nurse = new this.nurseModel(nurseData);
    const savedNurse = await nurse.save();
    return {
      id: (savedNurse._id as any).toString(),
      ...savedNurse.toObject(),
    };
  }

  async getAllNurse(): Promise<Nurse[]> {
    const nurses = await this.nurseModel.find().exec();
    return nurses.map((nurse) => ({
      id: (nurse._id as any).toString(),
      ...nurse.toObject(),
    }));
  }

  // async loginNurse(loginData: LoginDto): Promise<Nurse | null> {
  //   // ...
  //   return null; 
  // }

  // Authorized methods
  // async requestAuthorizedOtp(requestData: RequestOtpDto): Promise<{ success: boolean; message: string }> {
  //   // ...
  //   return { success: false, message: 'OTP auth disabled' };
  // }

  // async verifyAuthorizedOtp(verifyData: VerifyOtpDto): Promise<{ success: boolean; message: string; authorized?: Authorized }> {
  //   // ...
  //   return { success: false, message: 'OTP auth disabled' };
  // }

  async completeAuthorizedRegistration(authorizedId: string, authData: CreateAuthorizedDto): Promise<Authorized> {
    const authorized = await this.authorizedModel
      .findByIdAndUpdate(authorizedId, authData, { new: true })
      .exec();
    if (!authorized) {
      throw new Error('Authorized not found');
    }
    return {
      id: (authorized._id as any).toString(),
      ...authorized.toObject(),
    };
  }

  async createAuthorized(authData: CreateAuthorizedDto): Promise<Authorized> {
    // This method is now deprecated, use requestAuthorizedOtp and completeAuthorizedRegistration
    const existingAuthorized = await this.authorizedModel
      .findOne({ mobileNumber: authData.mobileNumber })
      .exec();
    if (existingAuthorized) {
      throw new Error('Authorized with this mobile number already exists');
    }

    const authorized = new this.authorizedModel(authData);
    const savedAuthorized = await authorized.save();
    return {
      id: (savedAuthorized._id as any).toString(),
      ...savedAuthorized.toObject(),
    };
  }

  // async loginAuthorized(loginData: LoginDto): Promise<Authorized | null> {
  //   // ...
  //   return null; 
  // }

  // Appointment methods
  async appointmentBooking(appointmentData: appointmentDto): Promise<string> {
    const appointment = new this.appointmentModel(appointmentData);
    const savedAppointment = await appointment.save();
    return (savedAppointment._id as any).toString();
  }

  async getUsersAppointment(userId: string): Promise<any[]> {
    const appointments = await this.appointmentModel.find({ userId }).exec();
    return appointments.map((appointment) => ({
      appointmentId: (appointment._id as any).toString(),
      ...appointment.toObject(),
    }));
  }
}
