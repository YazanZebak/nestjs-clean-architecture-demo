import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from './account.entity';
import { Status } from './enums/status.enum';

@Entity({ name: 'transaction' })
export class Transaction {
  @PrimaryGeneratedColumn({ name: 'transactionID' })
  transactionID: number;

  @Column()
  coins: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  @Column({ type: 'enum', enum: Status })
  status: Status;

  @ManyToOne(() => Account, { eager: true })
  @JoinColumn({ name: 'senderID', referencedColumnName: 'accountID' })
  sender: Account;

  @ManyToOne(() => Account, { eager: true })
  @JoinColumn({ name: 'reciverID', referencedColumnName: 'accountID' })
  receiver: Account;
}
