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
  RequestOtpDto,
  VerifyOtpDto,
  appointmentDto,
} from '../interfaces/user.interface';
import { UserDocument } from '../schemas/user.schema';
import { NurseDocument } from '../schemas/nurse.schema';
import { AuthorizedDocument } from '../schemas/authorized.schema';
import { AppointmentDocument } from '../schemas/appointment.schema';
import { OtpService } from '../otp/otp.service';

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
    private otpService: OtpService,
  ) {}

  // User methods
  async requestUserOtp(requestData: RequestOtpDto): Promise<{ success: boolean; message: string }> {
    const existingUser = await this.userModel
      .findOne({ mobileNumber: requestData.mobileNumber })
      .exec();

    if (existingUser) {
      // User exists, generate OTP for login
      const otp = this.otpService.generateOtp();
      const otpExpiry = this.otpService.getOtpExpiry();
      await this.userModel.updateOne(
        { mobileNumber: requestData.mobileNumber },
        { otp, otpExpiry }
      );
      // TODO: Send OTP via SMS
      return { success: true, message: 'OTP sent for login' };
    } else {
      // User does not exist, generate OTP for registration
      const otp = this.otpService.generateOtp();
      const otpExpiry = this.otpService.getOtpExpiry();
      const tempUser = new this.userModel({
        ...requestData,
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

  async verifyUserOtp(verifyData: VerifyOtpDto): Promise<{ success: boolean; message: string; user?: User }> {
    const user = await this.userModel
      .findOne({ mobileNumber: verifyData.mobileNumber })
      .exec();

    if (!user) {
      return { success: false, message: 'User not found' };
    }

    if (this.otpService.isOtpExpired(user.otpExpiry)) {
      return { success: false, message: 'OTP expired' };
    }

    if (user.otp !== verifyData.otp) {
      return { success: false, message: 'Invalid OTP' };
    }

    // Clear OTP
    await this.userModel.updateOne(
      { mobileNumber: verifyData.mobileNumber },
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

  async loginUser(loginData: LoginDto): Promise<User | null> {
    // This method is now deprecated, use requestUserOtp and verifyUserOtp
    const user = await this.userModel
      .findOne({ mobileNumber: loginData.mobileNumber })
      .exec();
    if (!user) return null;
    if (user.otp !== loginData.otp) return null;
    return {
      id: (user._id as any).toString(),
      ...user.toObject(),
    };
  }

  // Nurse methods
  async requestNurseOtp(requestData: RequestOtpDto): Promise<{ success: boolean; message: string }> {
    const existingNurse = await this.nurseModel
      .findOne({ mobileNumber: requestData.mobileNumber })
      .exec();

    if (existingNurse) {
      // Nurse exists, generate OTP for login
      const otp = this.otpService.generateOtp();
      const otpExpiry = this.otpService.getOtpExpiry();
      await this.nurseModel.updateOne(
        { mobileNumber: requestData.mobileNumber },
        { otp, otpExpiry }
      );
      // TODO: Send OTP via SMS
      return { success: true, message: 'OTP sent for login' };
    } else {
      // Nurse does not exist, generate OTP for registration
      const otp = this.otpService.generateOtp();
      const otpExpiry = this.otpService.getOtpExpiry();
      const tempNurse = new this.nurseModel({
        ...requestData,
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
      // TODO: Send OTP via SMS
      return { success: true, message: 'OTP sent for registration' };
    }
  }

  async verifyNurseOtp(verifyData: VerifyOtpDto): Promise<{ success: boolean; message: string; nurse?: Nurse }> {
    const nurse = await this.nurseModel
      .findOne({ mobileNumber: verifyData.mobileNumber })
      .exec();

    if (!nurse) {
      return { success: false, message: 'Nurse not found' };
    }

    if (this.otpService.isOtpExpired(nurse.otpExpiry)) {
      return { success: false, message: 'OTP expired' };
    }

    if (nurse.otp !== verifyData.otp) {
      return { success: false, message: 'Invalid OTP' };
    }

    // Clear OTP
    await this.nurseModel.updateOne(
      { mobileNumber: verifyData.mobileNumber },
      { otp: null, otpExpiry: null }
    );

    const nurseObj = {
      id: (nurse._id as any).toString(),
      ...nurse.toObject(),
    };

    if (nurse.firstName) {
      // Existing nurse, return for login
      return { success: true, message: 'Login successful', nurse: nurseObj };
    } else {
      // New nurse, return for registration completion
      return { success: true, message: 'OTP verified, proceed to complete registration', nurse: nurseObj };
    }
  }

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

  async loginNurse(loginData: LoginDto): Promise<Nurse | null> {
    // This method is now deprecated, use requestNurseOtp and verifyNurseOtp
    const nurse = await this.nurseModel
      .findOne({ mobileNumber: loginData.mobileNumber })
      .exec();
    if (!nurse) return null;
    if (nurse.otp !== loginData.otp) return null;
    return {
      id: (nurse._id as any).toString(),
      ...nurse.toObject(),
    };
  }

  // Authorized methods
  async requestAuthorizedOtp(requestData: RequestOtpDto): Promise<{ success: boolean; message: string }> {
    const existingAuthorized = await this.authorizedModel
      .findOne({ mobileNumber: requestData.mobileNumber })
      .exec();

    if (existingAuthorized) {
      // Authorized exists, generate OTP for login
      const otp = this.otpService.generateOtp();
      const otpExpiry = this.otpService.getOtpExpiry();
      await this.authorizedModel.updateOne(
        { mobileNumber: requestData.mobileNumber },
        { otp, otpExpiry }
      );
      // TODO: Send OTP via SMS
      return { success: true, message: 'OTP sent for login' };
    } else {
      // Authorized does not exist, generate OTP for registration
      const otp = this.otpService.generateOtp();
      const otpExpiry = this.otpService.getOtpExpiry();
      const tempAuthorized = new this.authorizedModel({
        ...requestData,
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

  async verifyAuthorizedOtp(verifyData: VerifyOtpDto): Promise<{ success: boolean; message: string; authorized?: Authorized }> {
    const authorized = await this.authorizedModel
      .findOne({ mobileNumber: verifyData.mobileNumber })
      .exec();

    if (!authorized) {
      return { success: false, message: 'Authorized not found' };
    }

    if (this.otpService.isOtpExpired(authorized.otpExpiry)) {
      return { success: false, message: 'OTP expired' };
    }

    if (authorized.otp !== verifyData.otp) {
      return { success: false, message: 'Invalid OTP' };
    }

    // Clear OTP
    await this.authorizedModel.updateOne(
      { mobileNumber: verifyData.mobileNumber },
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

  async loginAuthorized(loginData: LoginDto): Promise<Authorized | null> {
    // This method is now deprecated, use requestAuthorizedOtp and verifyAuthorizedOtp
    const authorized = await this.authorizedModel
      .findOne({ mobileNumber: loginData.mobileNumber })
      .exec();
    if (!authorized) return null;
    if (authorized.otp !== loginData.otp) return null;
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
    return appointments.map((appointment) => ({
      appointmentId: (appointment._id as any).toString(),
      ...appointment.toObject(),
    }));
  }
}
