import { IException } from 'src/domain/adapters/exceptions.interface';
import { Status } from 'src/domain/entities/enums/status.enum';
import { AbstractListPresenter } from 'src/domain/models/abstracts/abstract-list.presenter';
import { CreateTransactionDTO } from 'src/domain/models/transaction/dtos/create-transaction.dto';
import { UpdateTransactionDTO } from 'src/domain/models/transaction/dtos/update-transaction.dto';
import { TransactionPresenter } from 'src/domain/models/transaction/presentation/transaction.presenter';
import { IAccountRepository } from 'src/domain/repositories/account-repository.interface';
import { ITransactionRepository } from 'src/domain/repositories/transaction-repository.interface';

export class TransactionUseCases {
  constructor(
    private readonly transactionRepository: ITransactionRepository,
    private readonly accountRepository: IAccountRepository,
    private readonly exceptionService: IException,
  ) {}

  async findAll(
    page: number,
    limit: number,
    filter?: Record<string, any>,
    search?: string,
  ): Promise<AbstractListPresenter<TransactionPresenter>> {
    const response = await this.transactionRepository.findAll(
      page,
      limit,
      filter,
      search,
    );

    const transactions = response.transactions.map(
      (transaction) => new TransactionPresenter(transaction),
    );

    return { data: transactions, count: response.count };
  }

  async count(): Promise<{ count: number }> {
    const count = await this.transactionRepository.getTotalCount();
    return { count };
  }

  async findOneById(id: number): Promise<TransactionPresenter> {
    const transaction = await this.transactionRepository.findOneById(id);
    return new TransactionPresenter(transaction);
  }

  async create(
    transactionData: CreateTransactionDTO,
  ): Promise<TransactionPresenter> {
    const newTransaction = await this.transactionRepository.create({
      ...transactionData,
      status: Status.PENDING,
    });
    await this.accept(newTransaction.transactionID);
    return new TransactionPresenter(newTransaction);
  }

  async update(
    id: number,
    transactionData: UpdateTransactionDTO,
  ): Promise<TransactionPresenter> {
    const transaction = await this.transactionRepository.update(
      id,
      transactionData,
    );
    return new TransactionPresenter(transaction);
  }

  async accept(id: number): Promise<TransactionPresenter> {
    const queryRunner = await this.transactionRepository.createRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const transaction = await this.transactionRepository.findOneById(id);

      const sender = await this.accountRepository.findOneById(
        transaction.sender.accountID,
      );

      const receiver = await this.accountRepository.findOneById(
        transaction.receiver.accountID,
      );

      this.accountRepository.update(sender.accountID, {
        coins: sender.coins - transaction.coins,
      });

      this.accountRepository.update(receiver.accountID, {
        coins: receiver.coins + transaction.coins,
      });

      const updatedtransaction = await this.update(id, {
        status: Status.ACCEPT,
      });

      return updatedtransaction;
    } catch (err) {
      console.error(err);
      this.exceptionService.internalServerErrorException({
        message: 'Internal Server Error',
        errorCode: 500,
      });
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async reject(id: number): Promise<TransactionPresenter> {
    const updatedtransaction = await this.update(id, {
      status: Status.REJECT,
    });
    return updatedtransaction;
  }

  async delete(id: number): Promise<void> {
    await this.transactionRepository.remove(id);
  }
}
