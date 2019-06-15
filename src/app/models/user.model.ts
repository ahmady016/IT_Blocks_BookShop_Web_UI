export interface User {
  userId?: number;
  userName: string;
  email: string;
  userPassword: string;
  IsDeleted?: boolean;
}

export interface AuthUser {
  user: User
  accessToken: string
}
