import { userTypes } from 'src/user/user.schema';

export interface AuthPayload {
  email: string;
  role: userTypes;
  sub: string;
}
