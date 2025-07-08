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
  user: UserDTO;
} 