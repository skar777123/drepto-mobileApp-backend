export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  role: string;
  medicalHistory: string;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Nurse {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  gender: string;
  dateOfBirth: string;
  address: string;
  licenseNumber: string;
  role: string;
  specification: string;
  availiability: string;
  isAvailable: boolean;
  password?: string;
  experienceYears: number;
  rating: number;
  serviceTypes: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Authorized {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  dateOfBirth: string;
  address: string;
  role: string;
  gender: string;
  roleTitle: string;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  gender: string;
  role: string;
  dateOfBirth: string;
  address: string;
  medicalHistory: string;
  password: string;
}

export interface CreateNurseDto {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  dateOfBirth: string;
  address: string;
  gender: string;
  role: string;
  licenseNumber: string;
  specification: string;
  availiability: string;
  isAvailable: boolean;
  password: string;
  experienceYears: number;
  rating: number;
  serviceTypes: string[];
}

export interface CreateAuthorizedDto {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  role: string;
  mobileNumber: string;
  dateOfBirth: string;
  address: string;
  roleTitle: string;
  password: string;
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

export interface LoginDto {
  email: string;
  password: string;
}
