import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from 'src/domain/entities/transaction.entity';
import { CreateTransactionDTO } from 'src/domain/models/transaction/dtos/create-transaction.dto';
import { UpdateTransactionDTO } from 'src/domain/models/transaction/dtos/update-transaction.dto';
import { ITransactionRepository } from 'src/domain/repositories/transaction-repository.interface';
import {
  DataSource,
  FindManyOptions,
  ILike,
  QueryRunner,
  Repository,
} from 'typeorm';
import { ExceptionsService } from '../services/exceptions/exceptions.service';
import { AccountRepository } from './account.repository';
import { send } from 'process';

export class TransactionRepository implements ITransactionRepository {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionEntityRepository: Repository<Transaction>,
    private readonly dataSource: DataSource,
    private readonly accountRepository: AccountRepository,
    private readonly exceptionService: ExceptionsService,
  ) {}

  async findAll(
    page: number,
    limit: number,
    filter?: Record<string, any>,
    search?: string,
  ): Promise<{ transactions: Transaction[]; count: number }> {
    if (page <= 0 || limit < 0) {
      this.exceptionService.badRequestException({
        message: 'Invalid page or limit value, value must not be negative',
        errorCode: 400,
      });
    }
    const skip = (page - 1) * limit;
    let where = [];

    if (search) {
      where.push({ sender: { email: ILike(`%${search}%`) } });
      where.push({ receiver: { email: ILike(`%${search}%`) } });
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

    const options: FindManyOptions<Transaction> = {
      where,
      skip,
      take: limit,
    };

    const [transactions, count] =
      await this.transactionEntityRepository.findAndCount(options);

    return { transactions: transactions, count: count };
  }

  async getTotalCount(): Promise<number> {
    const totalCount = await this.transactionEntityRepository.count();
    return totalCount;
  }

  async findOneById(id: number): Promise<Transaction> {
    const transaction = await this.transactionEntityRepository.findOne({
      where: { transactionID: id },
    });

    if (!transaction || transaction === null) {
      this.exceptionService.NotFoundException({
        message: 'Transaction does not exsit',
        errorCode: 404,
      });
    }

    return transaction;
  }

  findOneBy(
    property: keyof Transaction | string,
    value: any,
  ): Promise<Transaction> {
    const condition = {};
    condition[property] = value;
    return this.transactionEntityRepository.findOne({ where: condition });
  }

  async create(transactionData: CreateTransactionDTO): Promise<Transaction> {
    const sender = await this.accountRepository.findOneById(
      transactionData.senderID,
    );
    const receiver = await this.accountRepository.findOneById(
      transactionData.receiverID,
    );

    transactionData.sender = sender;
    transactionData.receiver = receiver;

    if (sender.coins < transactionData.coins) {
      this.exceptionService.badRequestException({
        message: 'Insufficient coins in the account',
        errorCode: 406,
      });
    }

    const newtransaction =
      this.transactionEntityRepository.create(transactionData);

    return await this.transactionEntityRepository.save(newtransaction);
  }

  async update(
    id: number,
    transactionData: UpdateTransactionDTO,
  ): Promise<Transaction> {
    await this.transactionEntityRepository.update(
      {
        transactionID: id,
      },
      transactionData,
    );

    return this.findOneById(id);
  }

  async remove(id: number): Promise<void> {
    const transaction = await this.transactionEntityRepository.findOne({
      where: { transactionID: id },
    });
    await this.transactionEntityRepository.softRemove(transaction);
  }

  async createRunner(): Promise<QueryRunner> {
    return this.dataSource.createQueryRunner();
  }
}
