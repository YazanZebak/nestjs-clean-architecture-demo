import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmpty, IsNumber, IsOptional, IsPositive } from 'class-validator';
import { Status } from 'src/domain/entities/enums/status.enum';

export class UpdateTransactionDTO {
  @IsEmpty()
  transactionID?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  coins?: number;

  @IsEmpty()
  createdAt?: Date;

  @IsEmpty()
  deletedAt?: Date;

  @IsEmpty()
  status?: Status;

  @IsEmpty()
  senderID?: number;

  @IsEmpty()
  receiverID?: number;
}
