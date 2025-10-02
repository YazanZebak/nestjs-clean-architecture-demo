import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Gym } from './gym.entity';
import { Account } from './account.entity';
import { Membership } from './membership.entity';
import { Gender } from './enums/gender.enum';
import { Coach } from './coach.entity';
import { Training } from './training.entity';

@Entity({ name: 'player' })
export class Player {
  @PrimaryGeneratedColumn({ name: 'playerID' })
  playerID: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  age: number;

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @Column()
  weight: number;

  @Column()
  height: number;

  @Column({ nullable: true })
  yearsOfPlaying?: number;

  @Column({ nullable: true })
  about?: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  @OneToOne(() => Account, (account) => account.player, {
    eager: true,
    cascade: ['soft-remove'],
  })
  @JoinColumn({ name: 'accountID' })
  account: Account;

  @ManyToMany(() => Gym, (gym) => gym.players)
  @JoinTable({
    name: 'membership',
    joinColumn: {
      name: 'playerID',
      referencedColumnName: 'playerID',
    },
    inverseJoinColumn: {
      name: 'gymID',
      referencedColumnName: 'gymID',
    },
  })
  gyms: Gym[];

  @OneToMany(() => Membership, (membership) => membership.player)
  memberships: Membership[];

  @ManyToMany(() => Coach, (coach) => coach.players)
  @JoinTable({
    name: 'training',
    joinColumn: {
      name: 'playerID',
      referencedColumnName: 'playerID',
    },
    inverseJoinColumn: {
      name: 'coachID',
      referencedColumnName: 'coachID',
    },
  })
  coaches: Coach[];

  @OneToMany(() => Training, (training) => training.player)
  trainings: Training[];
}
