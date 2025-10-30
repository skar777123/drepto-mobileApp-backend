export interface User {
  id?: string;
  name: string;
  mobileNumber: string;
  password: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserDto {
  name: string;
  mobileNumber: string;
  password: string;
}
