import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { TwilioService } from 'nestjs-twilio';
import { CreateUserDto, LoginUserDto } from '../dto/user.dto';
import { User } from '../interfaces/user.interface';
import { UserDocument } from '../schemas/user.schema';
// import { OtpService } from '../otp/otp.service';
import { AuthService } from '../auth/auth.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<UserDocument>,
    // private otpService: OtpService,
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
