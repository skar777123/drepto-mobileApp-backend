import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, CreateUserDto } from '../interfaces/user.interface';
import { UserDocument } from '../schemas/user.schema';
import { OtpService } from '../otp/otp.service';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<UserDocument>,
    private otpService: OtpService,
  ) {}

  async requestOtp(mobileNumber: Number): Promise<{ success: boolean; message: string }> {
    const existingUser = await this.userModel
      .findOne({ mobileNumber })
      .exec();

    if (existingUser) {
      // User exists, generate OTP for login
      const otp = this.otpService.generateOtp();
      const otpExpiry = this.otpService.getOtpExpiry();
      await this.userModel.updateOne(
        { mobileNumber },
        { otp, otpExpiry }
      );
      // TODO: Send OTP via SMS
      return { success: true, message: 'OTP sent for login' };
    } else {
      // User does not exist, generate OTP for registration
      const otp = this.otpService.generateOtp();
      const otpExpiry = this.otpService.getOtpExpiry();
      const tempUser = new this.userModel({
        mobileNumber,
        otp,
        otpExpiry,
        firstName: '', // Placeholder
        lastName: '',
        dateOfBirth: '',
        gender: '',
        role: 'user',
        medicalHistory: '',
      });
      await tempUser.save();
      // TODO: Send OTP via SMS
      return { success: true, message: 'OTP sent for registration' };
    }
  }

  async verifyOtp(mobileNumber: Number, otp: number): Promise<{ success: boolean; message: string; user?: User }> {
    const user = await this.userModel
      .findOne({ mobileNumber })
      .exec();

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    if (this.otpService.isOtpExpired(user.otpExpiry)) {
      return { success: false, message: 'OTP expired' };
    }

    if (user.otp !== otp) {
      return { success: false, message: 'Invalid OTP' };
    }

    // Clear OTP
    await this.userModel.updateOne(
      { mobileNumber },
      { otp: null, otpExpiry: null }
    );

    const userObj = {
      id: (user._id as any).toString(),
      ...user.toObject(),
    };

    if (user.firstName) {
      // Existing user, return for login
      return { success: true, message: 'Login successful', user: userObj };
    } else {
      // New user, return for registration completion
      return { success: true, message: 'OTP verified, proceed to complete registration', user: userObj };
    }
  }

  async completeRegistration(userId: string, userData: CreateUserDto): Promise<User> {
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
}
