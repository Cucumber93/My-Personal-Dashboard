export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface SignUpDto {
  name: string;
  email: string;
  passwordHash: string;
}


