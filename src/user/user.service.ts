import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { TwilioService } from 'nestjs-twilio';
import { CreateUserDto, LoginUserDto } from '../dto/user.dto';
import { User } from '../interfaces/user.interface';
import { UserDocument } from '../schemas/user.schema';
import { OtpService } from '../otp/otp.service';
import { AuthService } from '../auth/auth.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<UserDocument>,
    private otpService: OtpService,
    // private readonly twilioService: TwilioService,
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
  ) { }

  async register(createUserDto: CreateUserDto): Promise<{ user: any; token: string }> {
    const { mobileNumber, password, ...rest } = createUserDto;
    const existingUser = await this.userModel.findOne({ mobileNumber }).exec();
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({
      mobileNumber,
      password: hashedPassword,
      ...rest,
    });
    await newUser.save();

    const userObj = {
      id: (newUser._id as any).toString(),
      ...newUser.toObject(),
    };
    // delete userObj.password;

    const token = await this.authService.generateToken({ id: userObj.id, role: userObj.role });
    return { user: userObj, token };
  }

  async requestOtp(mobileNumber: string): Promise<{ success: boolean; message: string }> {
    const otp = this.otpService.generateOtp();
    const otpExpiry = this.otpService.getOtpExpiry();

    let user = await this.userModel.findOne({ mobileNumber }).exec();
    if (user) {
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      await user.save();
    } else {
      // Create a temporary or partial user or just return success for mock
      const newUser = new this.userModel({
        mobileNumber,
        email: `guest_${mobileNumber}@example.com`,
        otp,
        otpExpiry,
      });
      await newUser.save();
    }

    // Usually you would send the SMS here via Twilio.
    console.log(`[Mock SMS] OTP for ${mobileNumber} is ${otp}`);
    return { success: true, message: 'OTP sent successfully' };
  }

  async verifyOtp(mobileNumber: string, otp: number): Promise<{ success: boolean; message: string }> {
    const user = await this.userModel.findOne({ mobileNumber }).exec();
    if (!user) {
      throw new Error('User not found');
    }

    if (user.otp !== otp) {
      // Added a mock override for frontend testing where 1234 always passes
      if (otp !== 1234) {
        throw new Error('Invalid OTP');
      }
    }

    if (this.otpService.isOtpExpired(user.otpExpiry)) {
      if (otp !== 1234) {
        throw new Error('OTP has expired');
      }
    }

    user.otp = undefined as any;
    user.otpExpiry = undefined as any;
    await user.save();

    return { success: true, message: 'OTP verified successfully' };
  }

  async login(loginUserDto: LoginUserDto): Promise<{ user: any; token: string }> {
    const { mobileNumber, email, password } = loginUserDto;

    if (!mobileNumber && !email) {
      throw new Error('Please provide either mobile number or email');
    }

    const query = mobileNumber ? { mobileNumber } : { email };
    const user = await this.userModel.findOne(query).exec();
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const userObj = {
      id: (user._id as any).toString(),
      ...user.toObject(),
    };
    // delete userObj.password;

    const token = await this.authService.generateToken({ id: userObj.id, role: userObj.role });
    return { user: userObj, token };
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

  async findOrCreateOAuthUser(profile: any): Promise<any> {
    const { provider, id, email, firstName, lastName } = profile;
    
    // First try to find user by their OAuth ID
    const query = provider === 'google' ? { googleId: id } : { appleId: id };
    let user = await this.userModel.findOne(query).exec();

    if (!user && email) {
      // If not found by OAuth ID, try to find by email
      user = await this.userModel.findOne({ email }).exec();
      if (user) {
        // Link the OAuth ID to existing user
        if (provider === 'google') user.googleId = id;
        if (provider === 'apple') user.appleId = id;
        await user.save();
      }
    }

    if (!user) {
      // Create new user if totally new
      const newUser = new this.userModel({
        email,
        firstName,
        lastName,
        role: 'user',
        // Optional fields set below
      });
      if (provider === 'google') newUser.googleId = id;
      if (provider === 'apple') newUser.appleId = id;
      await newUser.save();
      user = newUser;
    }

    const userObj = {
      id: (user._id as any).toString(),
      ...user.toObject(),
    };
    
    // Generate token
    const token = await this.authService.generateToken({ id: userObj.id, role: userObj.role });
    return { user: userObj, token };
  }
}
