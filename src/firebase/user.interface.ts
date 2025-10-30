export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  dateOfBirth: string;
  address: string;
  medicalHistory: string;
  password: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Nurse {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  dateOfBirth: string;
  address: string;
  licenseNumber: string;
  specification: string;
  availiability: string;
  password: string;
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
  roleTitle: string;
  password: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
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
  licenseNumber: string;
  specification: string;
  availiability: string;
  password: string;
}

export interface CreateAuthorizedDto {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  dateOfBirth: string;
  address: string;
  roleTitle: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}
