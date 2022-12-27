export interface LoginFormValues {
  name: string;
  password: string;
}

export interface RegisterFormValues {
  name: string;
  password: string;
}

export type LoginRequest = LoginFormValues;

export interface LoginResponse {
  token: string;
  userId: number;
}

export type SignUpRequest = RegisterFormValues;
