import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  JoinColumn,
  PrimaryColumn,
  DeleteDateColumn,
  Check,
} from 'typeorm';
import { Player } from './player.entity';
import { Gym } from './gym.entity';
import { Status } from './enums/status.enum';

@Entity({ name: 'membership' })
export class Membership {
  @PrimaryGeneratedColumn({ name: 'membershipID' })
  membershipID: number;

  @PrimaryColumn({ name: 'playerID' })
  playerID: number;

  @PrimaryColumn({ name: 'gymID' })
  gymID: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'decimal' })
  paid: number;

  @Column({ type: 'decimal' })
  fee: number;

  @Column({ type: 'enum', enum: Status, default: Status.ACTIVE })
  status: Status;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => Player, (player) => player.memberships)
  @JoinColumn([{ name: 'playerID', referencedColumnName: 'playerID' }])
  player: Player;

  @ManyToOne(() => Gym, (gym) => gym.memberships)
  @JoinColumn([{ name: 'gymID', referencedColumnName: 'gymID' }])
  gym: Gym;
}
