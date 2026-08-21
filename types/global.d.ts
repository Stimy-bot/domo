declare interface User {
  id: string;
  email: string;
  role: 'superAdmin' | 'admin' | 'user';
}