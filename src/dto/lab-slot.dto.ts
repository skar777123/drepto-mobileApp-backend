import { IsString, IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateLabSlotDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  labId: string;

  @IsString()
  @IsNotEmpty()
  time: string;

  @IsString()
  @IsNotEmpty()
  date: string;

  @IsBoolean()
  isAvailable: boolean;
}

export class UpdateLabSlotDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  labId?: string;

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
