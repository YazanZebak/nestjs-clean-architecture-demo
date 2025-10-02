import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Account,
  STRONG_PASSWORD_OPTIONS,
} from 'src/domain/entities/account.entity';
import { IAccountRepository } from 'src/domain/repositories/account-repository.interface';
import { Repository, FindManyOptions, ILike } from 'typeorm';
import { CreateAccountDTO } from '../../domain/models/account/dtos/create-account.dto';
import { UpdateAccountDTO } from '../../domain/models/account/dtos/update-account.dto';
import { ExceptionsService } from '../services/exceptions/exceptions.service';
import { isStrongPassword } from 'class-validator';
import { BcryptService } from '../services/bcrypt/bcrypt.service';

@Injectable()
export class AccountRepository implements IAccountRepository {
  constructor(
    @InjectRepository(Account)
    private readonly accountEntityRepository: Repository<Account>,
    private readonly bcryptService: BcryptService,
    private readonly exceptionService: ExceptionsService,
  ) {}

  async findAll(
    page: number,
    limit: number,
    filter?: Record<string, any>,
    search?: string,
  ): Promise<{ accounts: Account[]; count: number }> {
    if (page <= 0 || limit < 0) {
      this.exceptionService.badRequestException({
        message: 'Invalid page or limit value, value must not be negative',
        errorCode: 400,
      });
    }
    const skip = (page - 1) * limit;
    let where = [];

    if (search) {
      where.push({ email: ILike(`%${search}%`) });
    }

    if (filter) {
      Object.entries(filter).forEach(([property, value]) => {
        if (where.length) {
          where = where.map((element) => {
            return { ...element, [property]: value };
          });
        } else {
          where[property] = value;
        }
      });
    }

    const options: FindManyOptions<Account> = {
      where,
      skip,
      take: limit,
    };

    const [accounts, count] = await this.accountEntityRepository.findAndCount(
      options,
    );

    return { accounts: accounts, count: count };
  }

  async getTotalCount(): Promise<number> {
    const totalCount = await this.accountEntityRepository.count();
    return totalCount;
  }

  async findOneById(id: number): Promise<Account> {
    const account = await this.accountEntityRepository.findOneBy({
      accountID: id,
    });

    if (!account || account === null) {
      this.exceptionService.NotFoundException({
        message: 'Account does not exist',
        errorCode: 404,
      });
    }

    return account;
  }

  async findOneBy(
    property: keyof Account | string,
    value: any,
  ): Promise<Account | undefined> {
    const condition = {};
    condition[property] = value;
    return this.accountEntityRepository.findOne({
      where: condition,
    });
  }

  async create(accountData: CreateAccountDTO): Promise<Account> {
    const existingAccount = await this.findOneBy('email', accountData.email);

    if (existingAccount) {
      this.exceptionService.badRequestException({
        message: 'Email is already taken',
        errorCode: 400,
      });
    }

    if (!isStrongPassword(accountData.password, STRONG_PASSWORD_OPTIONS)) {
      this.exceptionService.badRequestException({
        message:
          'Password does not meet the required strength criteria. Please ensure your password is at least 6 characters long, contains at least 2 lowercase letters, 2 uppercase letters, 1 number, and 1 symbol.',
        errorCode: 400,
      });
    }

    const hashedPassword = await this.bcryptService.hash(accountData.password);

    const account = this.accountEntityRepository.create({
      ...accountData,
      password: hashedPassword,
    });

    return this.accountEntityRepository.save(account);
  }

  async update(id: number, accountData: UpdateAccountDTO): Promise<Account> {
    if (accountData.email) {
      const existingAccount = await this.findOneBy('email', accountData.email);

      if (existingAccount && existingAccount.accountID !== id) {
        this.exceptionService.badRequestException({
          message: 'Email is already taken',
          errorCode: 400,
        });
      }
    }

    if (accountData.password) {
      if (!isStrongPassword(accountData.password, STRONG_PASSWORD_OPTIONS)) {
        this.exceptionService.badRequestException({
          message:
            'Password does not meet the required strength criteria. Please ensure your password is at least 6 characters long, contains at least 2 lowercase letters, 2 uppercase letters, 1 number, and 1 symbol.',
          errorCode: 400,
        });
      }

      const hashedPassword = await this.bcryptService.hash(
        accountData.password,
      );

      accountData = { ...accountData, password: hashedPassword };
    }

    await this.accountEntityRepository.update(id, accountData);
    return this.findOneById(id);
  }

  async remove(id: number): Promise<void> {
    const account = await this.accountEntityRepository.findOne({
      where: { accountID: id },
      relations: ['player', 'coach', 'gym'],
    });
    await this.accountEntityRepository.softRemove(account);
  }

  async statistics(
    start: Date,
    end: Date,
  ): Promise<{ date: Date; count: number }[]> {
    const rawData = await this.accountEntityRepository
      .createQueryBuilder('account')
      .select('DATE(account.createdAt)', 'date')
      .addSelect('COUNT(account.accountID)', 'count')
      .where('account.createdAt BETWEEN :start AND :end', { start, end })
      .groupBy('DATE(account.createdAt)')
      .orderBy('DATE(account.createdAt)', 'ASC')
      .getRawMany();

    return rawData.map((data) => ({
      date: data.date,
      count: +data.count,
    }));
  }
}
