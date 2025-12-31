import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateAuthorizedDto {
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsString()
    @IsNotEmpty()
    gender: string;

    @IsString()
    @IsNotEmpty()
    role: string;

    @IsNumber()
    mobileNumber: number;

    @IsString()
    @IsNotEmpty()
    roleTitle: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}

export class LoginAuthorizedDto {
    @IsNumber()
    mobileNumber: number;

    @IsString()
    @IsNotEmpty()
    password: string;
}

export class UpdateAuthorizedDto {
    @IsString()
    @IsOptional()
    firstName?: string;

    @IsString()
    @IsOptional()
    lastName?: string;

    @IsString()
    @IsOptional()
    gender?: string;

    @IsString()
    @IsOptional()
    role?: string;

    @IsNumber()
    @IsOptional()
    mobileNumber?: number;

    @IsString()
    @IsOptional()
    roleTitle?: string;
}
