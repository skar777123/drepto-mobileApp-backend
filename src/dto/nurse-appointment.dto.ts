import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';

export type NurseServiceType = 'homeCare' | 'followUp' | 'specialty';

export type NurseAppointmentStatus =
  | 'scheduled'
  | 'inProgress'
  | 'completed'
  | 'cancelled';

export class CreateNurseAppointmentDto {
  @IsString()
  @IsNotEmpty()
  nurseId: string;

  @IsString()
  @IsNotEmpty()
  nurseName: string;

  @IsEnum(['homeCare', 'followUp', 'specialty'])
  serviceType: NurseServiceType;

  @IsString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  time: string;

  @IsEnum(['scheduled', 'inProgress', 'completed', 'cancelled'])
  status: NurseAppointmentStatus;

  @IsString()
  @IsNotEmpty()
  statusLabel: string;
}

export class UpdateNurseAppointmentDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nurseId?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nurseName?: string;

  @IsOptional()
  @IsEnum(['homeCare', 'followUp', 'specialty'])
  serviceType?: NurseServiceType;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  date?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  time?: string;

  @IsOptional()
  @IsEnum(['scheduled', 'inProgress', 'completed', 'cancelled'])
  status?: NurseAppointmentStatus;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  statusLabel?: string;
}
