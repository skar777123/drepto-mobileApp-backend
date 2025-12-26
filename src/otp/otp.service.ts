import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

// @Injectable()
// export class OtpService {
//   generateOtp(): number {
//     return crypto.randomInt(100000, 1000000); // 6-digit OTP
//   }

//   isOtpExpired(expiry: Date): boolean {
//     return new Date() > expiry;
//   }

//   getOtpExpiry(): Date {
//     const now = new Date();
//     now.setMinutes(now.getMinutes() + 5); // OTP valid for 5 minutes
//     return now;
//   }
// }
