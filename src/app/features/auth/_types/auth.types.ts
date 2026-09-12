export interface LoginRequest {
  username: string;
  password: string;
  expiresInMins?: number;
}

export interface LoginResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
}

export interface UserLookupResponse {
  users: UserLookup[];
  total: number;
  skip: number;
  limit: number;
}

export interface UserLookup {
  id: number;
  username: string;
  email: string;
}