import { Injectable } from '@nestjs/common';
import { AccountRole } from 'src/domain/entities/enums/account-role.enum';
import { Request } from 'express';

@Injectable()
export class GlobalHelperService {
  applyRoleBasedFilter(
    request: Request,
    filter: Record<string, any>,
  ): Record<string, any> {
    const accountID = request['user'].accountID;
    const role = request['user'].role;

    switch (role) {
      case AccountRole.PLAYER:
        filter = {
          ...filter,
          player: {
            ...filter?.player,
            account: { ...filter?.player?.account, accountID },
          },
        };
        break;

      case AccountRole.COACH:
        filter = {
          ...filter,
          coach: {
            ...filter?.coach,
            account: { ...filter?.coach?.account, accountID },
          },
        };
        break;

      case AccountRole.GYM_ADMIN:
        filter = {
          ...filter,
          gym: {
            ...filter?.gym,
            account: { ...filter?.gym?.account, accountID },
          },
        };
        break;

      default:
        filter = {
          ...filter,
          account: { ...filter?.account, accountID },
        };
        break;
    }

    return filter;
  }
}
