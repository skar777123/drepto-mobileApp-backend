import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';

export type AppointmentStatus = 'upcoming' | 'past';

export class CreateDoctorAppointmentDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  doctorId: string;

  @IsString()
  @IsNotEmpty()
  doctorName: string;

  @IsString()
  @IsNotEmpty()
  specialization: string;

  @IsString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  time: string;

  @IsEnum(['upcoming', 'past'])
  status: AppointmentStatus;

  @IsString()
  @IsNotEmpty()
  reminderText: string;
}

export class UpdateDoctorAppointmentDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  doctorId?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  doctorName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  specialization?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  date?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  time?: string;

  @IsOptional()
  @IsEnum(['upcoming', 'past'])
  status?: AppointmentStatus;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  reminderText?: string;
}
