import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Player } from './player.entity';
import { Coach } from './coach.entity';
import { Account } from './account.entity';
import { Membership } from './membership.entity';
import { WeeklyTime } from './interfaces/weekly-time.interface';
import { Enrollment } from './enrollment.entity';
import { Category } from './category.entity';

@Entity({ name: 'gym' })
export class Gym {
  @PrimaryGeneratedColumn({ name: 'gymID' })
  gymID: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  logo?: string;

  @Column()
  address: string;

  @Column()
  phoneNumber: string;

  @Column({ type: 'decimal' })
  latitude: number;

  @Column({ type: 'decimal' })
  longitude: number;

  @Column('jsonb', { nullable: true })
  categories: Category[];

  @Column('jsonb', { nullable: true })
  openingTimes: WeeklyTime[];

  @Column('jsonb', { nullable: true })
  gallery: string[];

  @Column({ nullable: true })
  price?: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  @OneToOne(() => Account, (account) => account.gym, {
    eager: true,
    cascade: ['soft-remove'],
  })
  @JoinColumn({ name: 'accountID' })
  account: Account;

  @ManyToMany(() => Player, (player) => player.gyms)
  players: Player[];

  @OneToMany(() => Membership, (membership) => membership.gym)
  memberships: Membership[];

  @ManyToMany(() => Coach, (coach) => coach.gyms)
  coaches: Coach[];

  @OneToMany(() => Enrollment, (enrollment) => enrollment.gym)
  enrollments: Enrollment[];
}
