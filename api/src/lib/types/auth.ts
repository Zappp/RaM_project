export interface User {
  id: string;
  email?: string;
  emailVerified: boolean;
}

export interface CachedUser {
  user: User;
  expiresAt: number;
}

export interface AuthProps {
  email: string;
  password: string;
}
