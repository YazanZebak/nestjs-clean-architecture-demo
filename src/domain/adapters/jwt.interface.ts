import { AccountRole } from '../entities/enums/account-role.enum';

export interface IJwtServicePayload {
  accountID: number;
  role: AccountRole;
}

export interface IJwtService {
  createToken(payload: IJwtServicePayload, expiresIn?: string): string;
  verifyToken(token: string): Promise<IJwtServicePayload>;
}
