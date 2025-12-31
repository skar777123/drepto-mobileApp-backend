import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Authorized, CreateAuthorizedDto } from '../interfaces/user.interface';
import { LoginAuthorizedDto } from '../dto/authorized.dto';
import { AuthorizedDocument } from '../schemas/authorized.schema';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AuthorizedService {
  constructor(
    @InjectModel('Authorized') private authorizedModel: Model<AuthorizedDocument>,
    private authService: AuthService,
  ) { }

  async register(createAuthorizedDto: CreateAuthorizedDto): Promise<{ authorized: any; token: string }> {
    const { mobileNumber, password, ...rest } = createAuthorizedDto;
    const existingAuthorized = await this.authorizedModel.findOne({ mobileNumber }).exec();
    if (existingAuthorized) {
      throw new Error('Authorized already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAuthorized = new this.authorizedModel({
      mobileNumber,
      password: hashedPassword,
      ...rest,
    });
    await newAuthorized.save();

    const authorizedObj = {
      id: (newAuthorized._id as any).toString(),
      ...newAuthorized.toObject(),
    };

    const token = await this.authService.generateToken({ id: authorizedObj.id, role: authorizedObj.role });
    return { authorized: authorizedObj, token };
  }

  async login(loginAuthorizedDto: LoginAuthorizedDto): Promise<{ authorized: any; token: string }> {
    const { mobileNumber, password } = loginAuthorizedDto;
    const authorized = await this.authorizedModel.findOne({ mobileNumber }).exec();
    if (!authorized) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, authorized.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
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
