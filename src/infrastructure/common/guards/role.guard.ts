import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AccountRole } from 'src/domain/entities/enums/account-role.enum';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflactor: Reflector) {}

  matchRoles(roles: AccountRole[], userRole: AccountRole) {
    return roles.some((role) => role === userRole);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    return true;
    const roles = this.reflactor.get<AccountRole[]>(
      'roles',
      context.getHandler(),
    );

    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const account = request.user;

    if (!this.matchRoles(roles, account.role)) {
      throw new ForbiddenException({
        message: `Access denied. Only accounts with ${roles} role can access this resource.`,
        errorCode: 403,
      });
    }

    return true;
  }
}
