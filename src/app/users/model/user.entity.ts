
export interface User {
  id?: number;
  username: string;
  email?: string;
  password?: string;
  role?: 'PERSON' | 'COMPANY';
  token?: string;
}
