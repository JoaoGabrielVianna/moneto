// src/models/user.tsx
export type User = {
    id: string;
    name: string;
    email: string;
    created_at: string; // ISO string vindo do backend
    updated_at: string; // ISO string vindo do backend
  };
  
  // payload parcial para update (segue seu backend UserUpdate)
  export type UserUpdatePayload = Partial<{
    name: string;
    email: string;
    password: string;
  }>;
  