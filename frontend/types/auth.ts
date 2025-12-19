export enum UserRole {
  DEVELOPER = 'DEVELOPER',
  FOUNDER = 'FOUNDER',
  ADMIN = 'ADMIN',
}

export enum DeveloperTier {
  TIER_1 = 'TIER_1',
  TIER_2 = 'TIER_2',
  TIER_3 = 'TIER_3',
  TIER_4 = 'TIER_4',
}

export enum Availability {
  AVAILABLE = 'AVAILABLE',
  BUSY = 'BUSY',
  NOT_LOOKING = 'NOT_LOOKING',
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  role: UserRole;
}
