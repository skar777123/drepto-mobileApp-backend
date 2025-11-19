import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { TwilioService } from 'nestjs-twilio';
import { Nurse, CreateNurseDto, VerifyOtpNurseResponse } from '../interfaces/user.interface';
import { NurseDocument } from '../schemas/nurse.schema';
import { OtpService } from '../otp/otp.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class NurseService {
  constructor(
    @InjectModel('Nurse') private nurseModel: Model<NurseDocument>,
    private otpService: OtpService,
    // private readonly twilioService: TwilioService,
    private authService: AuthService,
  ) {}

  async requestOtp(mobileNumber: Number): Promise<{ success: boolean; message: string; otp?: number }> {
    const existingNurse = await this.nurseModel
      .findOne({ mobileNumber })
      .exec();

    if (existingNurse) {
      // Nurse exists, generate OTP for login
      const otp = this.otpService.generateOtp();
      const otpExpiry = this.otpService.getOtpExpiry();
      await this.nurseModel.updateOne(
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
      // Nurse does not exist, generate OTP for registration
      const otp = this.otpService.generateOtp();
      const otpExpiry = this.otpService.getOtpExpiry();
      const tempNurse = new this.nurseModel({
        mobileNumber,
        otp,
        otpExpiry,
        firstName: '', // Placeholder
        lastName: '',
        dateOfBirth: '',
        gender: '',
        role: 'nurse',
        licenseNumber: '',
        specification: '',
        availiability: '',
        isAvailable: false,
        experienceYears: 0,
        serviceTypes: [],
      });
      await tempNurse.save();
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

  async verifyOtp(mobileNumber: Number, otp: number): Promise<VerifyOtpNurseResponse> {
    const nurse = await this.nurseModel
      .findOne({ mobileNumber })
      .exec();

    if (!nurse) {
      return { success: false, message: 'Nurse not found' };
    }

    if (this.otpService.isOtpExpired(nurse.otpExpiry)) {
      return { success: false, message: 'OTP expired' };
    }

    if (nurse.otp !== otp) {
      return { success: false, message: 'Invalid OTP' };
    }

    // Clear OTP
    await this.nurseModel.updateOne(
      { mobileNumber },
      { otp: null, otpExpiry: null }
    );

    const nurseObj = {
      id: (nurse._id as any).toString(),
      ...nurse.toObject(),
    };

    if (nurse.firstName) {
      // Existing nurse, return for login with token
      const token = await this.authService.generateToken({ id: nurseObj.id, role: nurseObj.role });
      return { success: true, message: 'Login successful', nurse: nurseObj, token };
    } else {
      // New nurse, return for registration completion without token
      return { success: true, message: 'OTP verified, proceed to complete registration', nurse: nurseObj };
    }
  }

  async completeRegistration(nurseId: string, nurseData: CreateNurseDto): Promise<Nurse> {
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

  // async create(createNurseDto: Partial<Nurse>): Promise<Nurse> {
  //   const createdNurse = new this.nurseModel(createNurseDto);
  //   return createdNurse.save();
  // }

  async findAll(): Promise<Nurse[]> {
    return this.nurseModel.find().exec();
  }

  async findOne(id: string): Promise<Nurse> {
    const nurse = await this.nurseModel.findById(id).exec();
    if (!nurse) {
      throw new NotFoundException(`Nurse with ID ${id} not found`);
    }
    return nurse;
  }

  async update(id: string, updateNurseDto: Partial<Nurse>): Promise<Nurse> {
    const updatedNurse = await this.nurseModel
      .findByIdAndUpdate(id, updateNurseDto, { new: true })
      .exec();
    if (!updatedNurse) {
      throw new NotFoundException(`Nurse with ID ${id} not found`);
    }
    return updatedNurse;
  }

  async remove(id: string): Promise<Nurse> {
    const deletedNurse = await this.nurseModel.findByIdAndDelete(id).exec();
    if (!deletedNurse) {
      throw new NotFoundException(`Nurse with ID ${id} not found`);
    }
    return deletedNurse;
  }
}
