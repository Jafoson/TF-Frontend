export interface RegisterRequestDTO {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequestDTO {
  usernameOrEmail: string;
  password: string;
}

export interface UserDTO {
  userId: string;
  username: string;
  email: string;
}

export interface AuthResponseDTO {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenResponseDTO {
  accessToken: string;
}

export interface VerifyCodeRequestDTO {
  code: string;
}

export interface EmailRequestDTO {
  email: string;
}

export interface ResetPasswordRequestDTO {
  token: string;
  newPassword: string;
}