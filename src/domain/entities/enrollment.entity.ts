import {
  Entity,
  PrimaryGeneratedColumn,
  PrimaryColumn,
  CreateDateColumn,
  Column,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Coach } from './coach.entity';
import { Status } from './enums/status.enum';
import { Gym } from './gym.entity';
import { WeeklyTime } from './interfaces/weekly-time.interface';

@Entity({ name: 'enrollment' })
export class Enrollment {
  @PrimaryGeneratedColumn({ name: 'enrollmentID' })
  enrollmentID: number;

  @PrimaryColumn({ name: 'coachID' })
  coachID: number;

  @PrimaryColumn({ name: 'gymID' })
  gymID: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column('jsonb', { nullable: true })
  shiftTimes?: WeeklyTime[];

  @Column({ type: 'decimal' })
  salary: number;

  @Column({ type: 'enum', enum: Status, default: Status.ACTIVE })
  status: Status;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => Coach, (coach) => coach.enrollments)
  @JoinColumn([{ name: 'coachID', referencedColumnName: 'coachID' }])
  coach: Coach;

  @ManyToOne(() => Gym, (gym) => gym.enrollments)
  @JoinColumn([{ name: 'gymID', referencedColumnName: 'gymID' }])
  gym: Gym;
}
