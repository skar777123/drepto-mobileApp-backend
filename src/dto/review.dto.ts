import { IsString, IsNumber, IsOptional, IsArray, Min, Max, IsMongoId } from 'class-validator';

export class CreateReviewDto {
    @IsMongoId()
    productId: string;

    @IsOptional()
    @IsMongoId()
    userId?: string;

    @IsNumber()
    @Min(1)
    @Max(5)
    rating: number;

    @IsOptional()
    @IsString()
    reviewText?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    images?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    videos?: string[];
}

export class UpdateReviewDto {
    @IsOptional()
    @IsNumber()
    @Min(1)
    @Max(5)
    rating?: number;

    @IsOptional()
    @IsString()
    reviewText?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    images?: string[];

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    videos?: string[];
}
