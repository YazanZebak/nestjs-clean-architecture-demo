import { CreateAccountDTO } from '../models/account/dtos/create-account.dto';
import { UpdateAccountDTO } from '../models/account/dtos/update-account.dto';
import { Account } from '../entities/account.entity';

export interface IAccountRepository {
  findAll(
    page: number,
    limit: number,
    filter?: Record<string, any>,
    search?: string,
  ): Promise<{ accounts: Account[]; count: number }>;

  getTotalCount(): Promise<number>;

  findOneById(id: number): Promise<Account>;

  findOneBy(property: keyof Account, value: any): Promise<Account | undefined>;

  create(accountData: CreateAccountDTO): Promise<Account>;

  update(id: number, accountData: UpdateAccountDTO): Promise<Account>;

  remove(id: number): Promise<void>;

  statistics(start: Date, end: Date): Promise<{ date: Date; count: number }[]>;
}
