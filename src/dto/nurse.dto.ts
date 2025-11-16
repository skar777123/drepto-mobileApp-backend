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
  HOMECARE = 'homeCare',
  FOLLOWUP = 'followUp',
  SPECIALTY = 'specialty',
}

export class CreateNurseDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  mobileNumber: string;

  @IsString()
  @IsNotEmpty()
  gender: string;

  @IsString()
  @IsNotEmpty()
  dateOfBirth: string;

  @IsString()
  @IsNotEmpty()
  address: string;

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

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsNumber()
  @Min(0)
  experienceYears: number;

  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @IsArray()
  @IsEnum(NurseServiceType, { each: true })
  serviceTypes: NurseServiceType[];
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
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  mobileNumber?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  gender?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  address?: string;

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
  @IsString()
  @IsNotEmpty()
  password?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  experienceYears?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsArray()
  @IsEnum(NurseServiceType, { each: true })
  serviceTypes?: NurseServiceType[];
}
