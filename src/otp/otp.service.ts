import { Injectable } from '@nestjs/common';

@Injectable()
export class OtpService {
  generateOtp(): number {
    return Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
  }

  isOtpExpired(expiry: Date): boolean {
    return new Date() > expiry;
  }

  getOtpExpiry(): Date {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 5); // OTP valid for 5 minutes
    return now;
  }
}
