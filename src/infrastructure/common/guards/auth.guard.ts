import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { JwtTokenService } from 'src/infrastructure/services/jwt/jwt.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtTokenService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new ForbiddenException({
        message: 'Unauthorized: Access Denied. Please log in to continue.',
        errorCode: 403,
      });
    }

    const decoded = await this.jwtService.verifyToken(token);
    request.user = decoded;
    return true;
  }
}
