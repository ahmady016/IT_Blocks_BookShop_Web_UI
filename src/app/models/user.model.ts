export interface User {
  userId?: number;
  userName: string;
  email: string;
  password?: string;
  address: string;
  mobile: string;
  birthDate: Date | string | null;
  gender: boolean;
  IsDeleted?: boolean;
}

export interface AuthUser {
  user: User
  accessToken: string
}
