import { IsString, IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateDoctorTimeSlotDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  doctorId: string;

  @IsString()
  @IsNotEmpty()
  time: string;

  @IsString()
  @IsNotEmpty()
  date: string;

  @IsBoolean()
  isAvailable: boolean;
}

export class UpdateDoctorTimeSlotDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  doctorId?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  time?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  date?: string;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}
