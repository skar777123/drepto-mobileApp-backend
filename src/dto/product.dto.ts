
import { IsString, IsNumber, IsOptional, IsArray, IsMongoId } from 'class-validator';

export class CreateProductDto {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsOptional()
    @IsString()
    detailedDescription?: string;

    @IsNumber()
    price: number;

    @IsNumber()
    mrp: number;

    @IsArray()
    @IsString({ each: true })
    images: string[];

    @IsString()
    category: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    ingredients?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    benefits?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    sideEffects?: string[];

    @IsOptional()
    @IsString()
    developmentStory?: string;
}

export class UpdateProductDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsString()
    detailedDescription?: string;

    @IsOptional()
    @IsNumber()
    price?: number;

    @IsOptional()
    @IsNumber()
    mrp?: number;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    images?: string[];

    @IsOptional()
    @IsString()
    category?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    ingredients?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    benefits?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    sideEffects?: string[];

    @IsOptional()
    @IsString()
    developmentStory?: string;
}
