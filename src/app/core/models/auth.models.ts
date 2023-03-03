export class User2 {
  id?: number;
  username?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  token?: string;
  email?: string;
}
export interface User {
  id?:             number;
  usuario?:        string;
  password?:       string;
  nombres?:        string;
  apellidos?:      string;
  dui?:            string;
  foto?:           null;
  estado?:         string;
  fecha_creacion?: Date;
  id_rol?:         number;
  id_sucursal?:    number;
  token?:          string;
  id_general?:     number;
  nombre_sistema?: string;
  impuesto:       number;
}
