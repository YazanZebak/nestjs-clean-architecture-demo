import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  IJwtService,
  IJwtServicePayload,
} from 'src/domain/adapters/jwt.interface';
import { EnvironmentConfigService } from 'src/infrastructure/configuration/environment-config/environment-config.service';

@Injectable()
export class JwtTokenService implements IJwtService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: EnvironmentConfigService,
  ) {}

  createToken(payload: IJwtServicePayload, expiresIn?: string): string {
    return this.jwtService.sign(payload, {
      secret: this.configService.getJwtSecret(),
      expiresIn: expiresIn
        ? expiresIn
        : this.configService.getJwtExpirationTime(),
    });
  }

  async verifyToken(token: string): Promise<IJwtServicePayload> {
    const decode = await this.jwtService.verifyAsync(token);
    return decode;
  }
}
