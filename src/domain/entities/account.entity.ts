import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Coach } from './coach.entity';
import { Player } from './player.entity';
import { Gym } from './gym.entity';
import { AccountRole } from './enums/account-role.enum';
import { Status } from './enums/status.enum';

@Entity({ name: 'account' })
export class Account {
  @PrimaryGeneratedColumn({ name: 'accountID' })
  accountID: number;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column({ type: 'enum', enum: AccountRole })
  role: AccountRole;

  @Column({ type: 'enum', enum: Status })
  active: Status;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  @Column({ nullable: true })
  phoneNumber?: string;

  @Column({ nullable: true })
  profileImage?: string;

  @Column({ default: 0 })
  coins: number;

  @OneToOne(() => Player, (player) => player.account, {
    cascade: ['soft-remove'],
  })
  player?: Player;

  @OneToOne(() => Coach, (coach) => coach.account, {
    cascade: ['soft-remove'],
  })
  coach?: Coach;

  @OneToOne(() => Gym, (gym) => gym.account, {
    cascade: ['soft-remove'],
  })
  gym?: Gym;
}

export const STRONG_PASSWORD_OPTIONS = {
  minLength: 6,
  minLowercase: 2,
  minUppercase: 2,
  minNumbers: 1,
  minSymbols: 1,
};
