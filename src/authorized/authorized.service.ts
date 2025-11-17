import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Authorized, CreateAuthorizedDto } from '../interfaces/user.interface';
import { AuthorizedDocument } from '../schemas/authorized.schema';
import { OtpService } from '../otp/otp.service';

@Injectable()
export class AuthorizedService {
  constructor(
    @InjectModel('Authorized') private authorizedModel: Model<AuthorizedDocument>,
    private otpService: OtpService,
  ) {}

  async requestOtp(mobileNumber: Number): Promise<{ success: boolean; message: string }> {
    const existingAuthorized = await this.authorizedModel
      .findOne({ mobileNumber })
      .exec();

    if (existingAuthorized) {
      // Authorized exists, generate OTP for login
      const otp = this.otpService.generateOtp();
      const otpExpiry = this.otpService.getOtpExpiry();
      await this.authorizedModel.updateOne(
        { mobileNumber },
        { otp, otpExpiry }
      );
      // TODO: Send OTP via SMS
      return { success: true, message: 'OTP sent for login' };
    } else {
      // Authorized does not exist, generate OTP for registration
      const otp = this.otpService.generateOtp();
      const otpExpiry = this.otpService.getOtpExpiry();
      const tempAuthorized = new this.authorizedModel({
        mobileNumber,
        otp,
        otpExpiry,
        firstName: '', // Placeholder
        lastName: '',
        gender: '',
        role: 'authorized',
        roleTitle: '',
      });
      await tempAuthorized.save();
      // TODO: Send OTP via SMS
      return { success: true, message: 'OTP sent for registration' };
    }
  }

  async verifyOtp(mobileNumber: Number, otp: number): Promise<{ success: boolean; message: string; authorized?: Authorized }> {
    const authorized = await this.authorizedModel
      .findOne({ mobileNumber })
      .exec();

    if (!authorized) {
      return { success: false, message: 'Authorized not found' };
    }

    if (this.otpService.isOtpExpired(authorized.otpExpiry)) {
      return { success: false, message: 'OTP expired' };
    }

    if (authorized.otp !== otp) {
      return { success: false, message: 'Invalid OTP' };
    }

    // Clear OTP
    await this.authorizedModel.updateOne(
      { mobileNumber },
      { otp: null, otpExpiry: null }
    );

    const authorizedObj = {
      id: (authorized._id as any).toString(),
      ...authorized.toObject(),
    };

    if (authorized.firstName) {
      // Existing authorized, return for login
      return { success: true, message: 'Login successful', authorized: authorizedObj };
    } else {
      // New authorized, return for registration completion
      return { success: true, message: 'OTP verified, proceed to complete registration', authorized: authorizedObj };
    }
  }

  async completeRegistration(authorizedId: string, authorizedData: CreateAuthorizedDto): Promise<Authorized> {
    const authorized = await this.authorizedModel
      .findByIdAndUpdate(authorizedId, authorizedData, { new: true })
      .exec();
    if (!authorized) {
      throw new Error('Authorized not found');
    }
    return {
      id: (authorized._id as any).toString(),
      ...authorized.toObject(),
    };
  }

  async getAuthorized(authorizedId: string): Promise<Authorized | null> {
    const authorized = await this.authorizedModel.findById(authorizedId).exec();
    if (!authorized) return null;
    return {
      id: (authorized._id as any).toString(),
      ...authorized.toObject(),
    };
  }

  async getAllAuthorized(): Promise<Authorized[]> {
    const authorizeds = await this.authorizedModel.find().exec();
    return authorizeds.map((authorized) => ({
      id: (authorized._id as any).toString(),
      ...authorized.toObject(),
    }));
  }

  async updateAuthorized(
    authorizedId: string,
    updates: Partial<Authorized>,
  ): Promise<Authorized | null> {
    const authorized = await this.authorizedModel
      .findByIdAndUpdate(authorizedId, updates, { new: true })
      .exec();
    if (!authorized) return null;
    return {
      id: (authorized._id as any).toString(),
      ...authorized.toObject(),
    };
  }

  async deleteAuthorized(authorizedId: string): Promise<boolean> {
    const result = await this.authorizedModel.findByIdAndDelete(authorizedId).exec();
    return !!result;
  }
}
