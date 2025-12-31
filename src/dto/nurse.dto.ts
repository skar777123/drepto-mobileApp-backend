import {
  IsString,
  IsEmail,
  IsBoolean,
  IsNumber,
  Min,
  Max,
  IsNotEmpty,
  IsArray,
  IsEnum,
  IsOptional,
} from 'class-validator';

export enum NurseServiceType {
  GENERAL = 'general',
  ICU = 'icu',
  SURGICAL = 'surgical',
}

export class CreateNurseDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsNumber()
  mobileNumber: Number;

  @IsString()
  @IsNotEmpty()
  gender: string;



  @IsString()
  @IsNotEmpty()
  licenseNumber: string;

  @IsString()
  @IsNotEmpty()
  role: string;

  @IsString()
  @IsNotEmpty()
  specification: string;

  @IsString()
  @IsNotEmpty()
  availiability: string;

  @IsBoolean()
  isAvailable: boolean;

  @IsNumber()
  @Min(0)
  experienceYears: number;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsArray()
  @IsEnum(NurseServiceType, { each: true })
  serviceTypes: NurseServiceType[];
}

export class LoginNurseDto {
  @IsNumber()
  mobileNumber: number;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class UpdateNurseDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  firstName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  lastName?: string;

  @IsOptional()
  @IsNumber()
  mobileNumber?: Number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  gender?: string;



  @IsOptional()
  @IsString()
  @IsNotEmpty()
  licenseNumber?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  role?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  specification?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  availiability?: string;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  experienceYears?: number;

  // OTP is handled separately

  @IsOptional()
  @IsArray()
  @IsEnum(NurseServiceType, { each: true })
  serviceTypes?: NurseServiceType[];
}
