import {
  IsString,
  IsBoolean,
  IsNotEmpty,
  IsEnum,
  IsOptional,
} from 'class-validator';

export type NurseServiceType = 'homeCare' | 'followUp' | 'specialty';

export class CreateNurseTimeSlotDto {
  @IsString()
  @IsNotEmpty()
  nurseId: string;

  @IsEnum(['homeCare', 'followUp', 'specialty'])
  serviceType: NurseServiceType;

  @IsString()
  @IsNotEmpty()
  time: string;

  @IsString()
  @IsNotEmpty()
  date: string;

  @IsBoolean()
  isAvailable: boolean;
}

export class UpdateNurseTimeSlotDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nurseId?: string;

  @IsOptional()
  @IsEnum(['homeCare', 'followUp', 'specialty'])
  serviceType?: NurseServiceType;

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
