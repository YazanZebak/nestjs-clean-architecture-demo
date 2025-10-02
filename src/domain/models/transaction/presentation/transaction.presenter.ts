import { ApiProperty } from '@nestjs/swagger';
import { Account } from 'src/domain/entities/account.entity';
import { Status } from 'src/domain/entities/enums/status.enum';
import { AccountPresenter } from '../../account/presenters/account.presenter';
import { Transaction } from 'src/domain/entities/transaction.entity';

export class TransactionPresenter {
  @ApiProperty()
  transactionID: number;

  @ApiProperty()
  coins: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  deletedAt?: Date;

  @ApiProperty({ type: 'enum', enum: Status })
  status: Status;

  @ApiProperty({
    type: AccountPresenter,
    name: 'sender',
  })
  sender: Account;

  @ApiProperty({
    type: AccountPresenter,
    name: 'receiver',
  })
  receiver: Account;

  constructor(transaction: Transaction) {
    this.transactionID = transaction?.transactionID;
    this.coins = transaction?.coins;
    this.createdAt = transaction?.createdAt;
    this.deletedAt = transaction?.deletedAt;
    this.status = transaction?.status;
    this.sender = transaction?.sender;
    this.receiver = transaction?.receiver;
  }
}
