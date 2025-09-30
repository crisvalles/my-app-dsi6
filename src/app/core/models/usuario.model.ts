export interface Usuario {
  id?: number;
  username: string;
  password: string;
  correo: string;
  telefono?: string;
  activo?: boolean;
  fechaCreacion?: string;
}

