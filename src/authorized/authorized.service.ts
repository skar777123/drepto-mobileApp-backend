import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { TwilioService } from 'nestjs-twilio';
import { Authorized, CreateAuthorizedDto, VerifyOtpAuthorizedResponse } from '../interfaces/user.interface';
import { AuthorizedDocument } from '../schemas/authorized.schema';
import { OtpService } from '../otp/otp.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AuthorizedService {
  constructor(
    @InjectModel('Authorized') private authorizedModel: Model<AuthorizedDocument>,
    private otpService: OtpService,
    // private readonly twilioService: TwilioService,
    private authService: AuthService,
  ) {}

  async requestOtp(mobileNumber: Number): Promise<{ success: boolean; message: string; otp?: number }> {
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
      // try {
      //   await this.twilioService.client.messages.create({
      //     body: `Your OTP is: ${otp}`,
      //     from: process.env.TWILIO_PHONE_NUMBER,
      //     to: `+${mobileNumber}`,
      //   });
      //   return { success: true, message: 'OTP sent for login' };
      // } catch (error) {
      //   console.error('Error sending OTP:', error);
      //   return { success: false, message: 'Failed to send OTP' };
      // }
      return { success: true, message: 'OTP generated for login', otp };
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
      // try {
      //   await this.twilioService.client.messages.create({
      //     body: `Your OTP is: ${otp}`,
      //     from: process.env.TWILIO_PHONE_NUMBER,
      //     to: `+${mobileNumber}`,
      //   });
      //   return { success: true, message: 'OTP sent for registration' };
      // } catch (error) {
      //   console.error('Error sending OTP:', error);
      //   return { success: false, message: 'Failed to send OTP' };
      // }
      return { success: true, message: 'OTP generated for registration', otp };
    }
  }

  async verifyOtp(mobileNumber: Number, otp: number): Promise<VerifyOtpAuthorizedResponse> {
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
      // Existing authorized, return for login with token
      const token = await this.authService.generateToken({ id: authorizedObj.id, role: authorizedObj.role });
      return { success: true, message: 'Login successful', authorized: authorizedObj, token };
    } else {
      // New authorized, return for registration completion without token
      return { success: true, message: 'OTP verified, proceed to complete registration', authorized: authorizedObj };
    }
  }

  async completeRegistration(authorizedId: string, authorizedData: CreateAuthorizedDto): Promise<Authorized> {
    const authorized = await this.authorizedModel
      .findByIdAndUpdate(authorizedId, authorizedData, { new: true })
      .exec();
    if (!authorized) {
      throw new NotFoundException('Authorized not found');
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
