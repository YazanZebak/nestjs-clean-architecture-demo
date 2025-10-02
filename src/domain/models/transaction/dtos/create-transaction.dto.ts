import { ApiProperty } from '@nestjs/swagger';
import { IsEmpty, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { Account } from 'src/domain/entities/account.entity';
import { Status } from 'src/domain/entities/enums/status.enum';

export class CreateTransactionDTO {
  @IsEmpty()
  transactionID?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  coins: number;

  @IsEmpty()
  createdAt?: Date;

  @IsEmpty()
  deletedAt?: Date;

  @IsEmpty()
  status?: Status;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  senderID: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  receiverID: number;

  sender!: Account;

  receiver!: Account;
}
