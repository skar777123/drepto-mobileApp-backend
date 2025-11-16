import {
  IsString,
  IsNumber,
  Min,
  Max,
  IsNotEmpty,
  IsArray,
  IsEnum,
  IsOptional,
} from 'class-validator';

export type LabCategory = 'blood' | 'imaging' | 'cardio' | 'other';

export class CreateLabCenterDto {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsNumber()
  @Min(0)
  @Max(5)
  rating: number;

  @IsArray()
  @IsEnum(['blood', 'imaging', 'cardio', 'other'], { each: true })
  categories: LabCategory[];

  @IsString()
  @IsNotEmpty()
  nextAvailable: string;
}

export class UpdateLabCenterDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  location?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(5)
  rating?: number;

  @IsOptional()
  @IsArray()
  @IsEnum(['blood', 'imaging', 'cardio', 'other'], { each: true })
  categories?: LabCategory[];

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  nextAvailable?: string;
}
