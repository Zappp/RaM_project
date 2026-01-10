export interface User {
  id: string;
}

export interface CachedUser {
  user: User;
  expiresAt: number;
}
