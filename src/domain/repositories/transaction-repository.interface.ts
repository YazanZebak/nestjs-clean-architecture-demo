import { QueryRunner } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';
import { CreateTransactionDTO } from '../models/transaction/dtos/create-transaction.dto';
import { UpdateTransactionDTO } from '../models/transaction/dtos/update-transaction.dto';

export interface ITransactionRepository {
  findAll(
    page: number,
    limit: number,
    filter?: Record<string, any>,
    search?: string,
  ): Promise<{ transactions: Transaction[]; count: number }>;

  getTotalCount(): Promise<number>;

  findOneById(id: number): Promise<Transaction>;

  findOneBy(
    property: keyof Transaction,
    value: any,
  ): Promise<Transaction | undefined>;

  create(transactionData: CreateTransactionDTO): Promise<Transaction>;

  update(
    id: number,
    transactionData: UpdateTransactionDTO,
  ): Promise<Transaction>;

  remove(id: number): Promise<void>;

  createRunner(): Promise<QueryRunner>;
}
