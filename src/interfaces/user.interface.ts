export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  mobileNumber: Number;
  dateOfBirth: string;
  gender: string;
  role: string;
  medicalHistory: string;
  otp: Number;
  otpExpiry?: Date;
  createdAt?: string;
  updatedAt?: string;
}

export interface Nurse {
  id?: string;
  firstName: string;
  lastName: string;
  mobileNumber: Number;
  gender: string;
  dateOfBirth: string;
  licenseNumber: string;
  role: string;
  specification: string;
  availiability: string;
  isAvailable: boolean;
  experienceYears: number;
  otp: Number;
  otpExpiry?: Date;
  serviceTypes: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Authorized {
  id?: string;
  firstName: string;
  lastName: string;
  mobileNumber: Number;
  role: string;
  gender: string;
  roleTitle: string;
  otp: Number;
  otpExpiry?: Date;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  mobileNumber: Number;
  gender: string;
  role: string;
  dateOfBirth: string;
  medicalHistory: string;
}

export interface CreateNurseDto {
  firstName: string;
  lastName: string;
  mobileNumber: Number;
  dateOfBirth: string;
  gender: string;
  role: string;
  licenseNumber: string;
  specification: string;
  availiability: string;
  isAvailable: boolean;
  experienceYears: number;
  serviceTypes: string[];
}

export interface CreateAuthorizedDto {
  firstName: string;
  lastName: string;
  gender: string;
  role: string;
  mobileNumber: Number;
  roleTitle: string;
}

export interface RequestOtpDto {
  mobileNumber: number;
}

export interface VerifyOtpDto {
  mobileNumber: number;
  otp: number;
}

export interface LoginDto {
  mobileNumber: Number;
  otp: Number;
}

export interface appointmentDto {
  userId: string;
  patientName: string;
  address: string;
  mobileNumber: string;
  symptoms: string;
  date: string;
  time: string;
  nurseId: string;
  nurseName: string;
  nurseSpecialization: string;
  paymentMethod: string;
  transactionId: string;
  amount: number;
  appointmentId: string;
  status: string;
}
