import { IsNumber, Min, Max } from 'class-validator';

export class VerifyOtpDto {
  @IsNumber()
  mobileNumber: number;

  @IsNumber()
  @Min(100000)
  @Max(999999)
  otp: number;
}
