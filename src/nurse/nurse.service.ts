import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { TwilioService } from 'nestjs-twilio';
import { Nurse, CreateNurseDto, VerifyOtpNurseResponse } from '../interfaces/user.interface';
import { NurseDocument } from '../schemas/nurse.schema';
// import { OtpService } from '../otp/otp.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class NurseService {
  constructor(
    @InjectModel('Nurse') private nurseModel: Model<NurseDocument>,
    // private otpService: OtpService,
    // private readonly twilioService: TwilioService,
    private authService: AuthService,
  ) { }

  // async requestOtp(mobileNumber: Number): Promise<{ success: boolean; message: string; otp?: number }> {
  // ... (commented out) ...
  // }

  // async verifyOtp(mobileNumber: Number, otp: number): Promise<VerifyOtpNurseResponse> {
  // ... (commented out) ...
  // }

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
