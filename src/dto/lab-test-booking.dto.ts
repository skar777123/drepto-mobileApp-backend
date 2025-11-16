import {
  IsString,
  IsBoolean,
  IsNotEmpty,
  IsEnum,
  IsOptional,
} from 'class-validator';

export type LabTestStatus =
  | 'scheduled'
  | 'inProgress'
  | 'completed'
  | 'cancelled';

export class CreateLabTestBookingDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  labId: string;

  @IsString()
  @IsNotEmpty()
  labName: string;

  @IsString()
  @IsNotEmpty()
  testName: string;

  @IsEnum(['blood', 'imaging', 'cardio', 'other'])
  category: 'blood' | 'imaging' | 'cardio' | 'other';

  @IsString()
  @IsNotEmpty()
  date: string;

  @IsString()
  @IsNotEmpty()
  time: string;

  @IsEnum(['scheduled', 'inProgress', 'completed', 'cancelled'])
  status: LabTestStatus;

  @IsString()
  @IsNotEmpty()
  statusLabel: string;

  @IsBoolean()
  hasResult: boolean;

  @IsBoolean()
  requestAttached: boolean;
}

export class UpdateLabTestBookingDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  labId?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  labName?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  testName?: string;

  @IsOptional()
  @IsEnum(['blood', 'imaging', 'cardio', 'other'])
  category?: 'blood' | 'imaging' | 'cardio' | 'other';

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
  status?: LabTestStatus;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  statusLabel?: string;

  @IsOptional()
  @IsBoolean()
  hasResult?: boolean;

  @IsOptional()
  @IsBoolean()
  requestAttached?: boolean;
}
