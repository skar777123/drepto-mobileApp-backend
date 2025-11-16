import { IsString, IsNumber, Min, Max, IsNotEmpty } from 'class-validator';

export class CreateDoctorDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  specialization: string;

  @IsNumber()
  @Min(0)
  experienceYears: number;

  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @IsString()
  @IsNotEmpty()
  nextAvailable: string;
}

export class UpdateDoctorDto {
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsString()
  @IsNotEmpty()
  specialization?: string;

  @IsNumber()
  @Min(0)
  experienceYears?: number;

  @IsNumber()
  @Min(0)
  @Max(5)
  rating?: number;

  @IsString()
  @IsNotEmpty()
  nextAvailable?: string;
}
