import {
  Entity,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  CreateDateColumn,
  Column,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Coach } from './coach.entity';
import { Player } from './player.entity';
import { Program } from './program.entity';
import { Diet } from './diet.entity';
import { Rating } from './rating.entity';
import { Status } from './enums/status.enum';

@Entity({ name: 'training' })
export class Training {
  @PrimaryGeneratedColumn({ name: 'trainingID' })
  trainingID: number;

  @PrimaryColumn({ name: 'playerID' })
  playerID: number;

  @PrimaryColumn({ name: 'coachID' })
  coachID: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'enum', enum: Status, default: Status.PENDING })
  status: Status;

  @Column()
  startDate: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => Player, (player) => player.trainings, { eager: true })
  @JoinColumn([{ name: 'playerID', referencedColumnName: 'playerID' }])
  player: Player;

  @ManyToOne(() => Coach, (coach) => coach.trainings, { eager: true })
  @JoinColumn([{ name: 'coachID', referencedColumnName: 'coachID' }])
  coach: Coach;

  @OneToMany(() => Program, (program) => program.training)
  programs: Program[];

  @OneToMany(() => Diet, (diet) => diet.training)
  diets: Diet[];

  @OneToMany(() => Rating, (rating) => rating.training)
  ratings: Rating[];
}
