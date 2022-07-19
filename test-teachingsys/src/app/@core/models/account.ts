export class Account {
  accessToken: string;
  refreshToken: string;
  id: string;
  email: string;
  userName: string;
  password?: string;
  isVerified: boolean;
  roles: string[]
}
