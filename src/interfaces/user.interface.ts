export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  mobileNumber: Number;
  gender: string;
  role: string;
  // medicalHistory: string;
  // otp: Number;
  // otpExpiry?: Date;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
  orders?: any[];
}

export interface Nurse {
  id?: string;
  firstName: string;
  lastName: string;
  mobileNumber: Number;
  gender: string;
  licenseNumber: string;
  role: string;
  specification: string;
  availiability: string;
  isAvailable: boolean;
  experienceYears: number;
  password?: string;
  // otp: Number;
  // otpExpiry?: Date;
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
  password?: string;
  // otp: Number;
  // otpExpiry?: Date;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  mobileNumber: Number;
  gender: string;
  role: string;
  // medicalHistory: string;
  password?: string;
}

export interface CreateNurseDto {
  firstName: string;
  lastName: string;
  mobileNumber: Number;
  gender: string;
  role: string;
  licenseNumber: string;
  specification: string;
  availiability: string;
  isAvailable: boolean;
  experienceYears: number;

  serviceTypes: string[];
  password: string;
}

export interface CreateAuthorizedDto {
  firstName: string;
  lastName: string;
  gender: string;
  role: string;
  mobileNumber: Number;
  roleTitle: string;
  password: string;
}

export interface RequestOtpDto {
  mobileNumber: number;
}

export interface VerifyOtpDto {
  mobileNumber: number;
  otp: number;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

export interface VerifyOtpNurseResponse {
  success: boolean;
  message: string;
  nurse?: Nurse;
  token?: string;
}

export interface VerifyOtpAuthorizedResponse {
  success: boolean;
  message: string;
  authorized?: Authorized;
  token?: string;
}

export interface LoginNurseDto {
  mobileNumber: Number;
  password: string;
}

export interface LoginAuthorizedDto {
  mobileNumber: Number;
  password: string;
}

export interface LoginDto {
  mobileNumber?: Number;
  email?: string;
  otp?: Number;
  password?: string;
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
