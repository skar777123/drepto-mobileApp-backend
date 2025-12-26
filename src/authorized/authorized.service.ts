import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { TwilioService } from 'nestjs-twilio';
import { Authorized, CreateAuthorizedDto, VerifyOtpAuthorizedResponse } from '../interfaces/user.interface';
import { AuthorizedDocument } from '../schemas/authorized.schema';
// import { OtpService } from '../otp/otp.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AuthorizedService {
  constructor(
    @InjectModel('Authorized') private authorizedModel: Model<AuthorizedDocument>,
    // private otpService: OtpService,
    // private readonly twilioService: TwilioService,
    private authService: AuthService,
  ) { }

  // async requestOtp(mobileNumber: Number): Promise<{ success: boolean; message: string; otp?: number }> {
  // ... (commented out) ...
  // }

  // async verifyOtp(mobileNumber: Number, otp: number): Promise<VerifyOtpAuthorizedResponse> {
  // ... (commented out) ...
  // }

  async completeRegistration(authorizedId: string, authorizedData: CreateAuthorizedDto): Promise<{ authorized: Authorized; token: string }> {
    const authorized = await this.authorizedModel
      .findByIdAndUpdate(authorizedId, authorizedData, { new: true })
      .exec();
    if (!authorized) {
      throw new NotFoundException('Authorized not found');
    }
    const authorizedObj = {
      id: (authorized._id as any).toString(),
      ...authorized.toObject(),
    };
    const token = await this.authService.generateToken({ id: authorizedObj.id, role: authorizedObj.role });
    return { authorized: authorizedObj, token };
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
