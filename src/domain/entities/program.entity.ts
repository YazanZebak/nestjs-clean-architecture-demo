import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  Check,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Training } from './training.entity';
import { ExerciseItem } from './interfaces/exercise-item.interface';

@Entity({ name: 'program' })
@Check(`"startDate" <= "endDate"`)
export class Program {
  @PrimaryGeneratedColumn({ name: 'programID' })
  programID: number;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  description?: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column('jsonb')
  days: { day: string; exercises: ExerciseItem[] }[];

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => Training, (training) => training.programs)
  @JoinColumn([
    { name: 'playerID', referencedColumnName: 'playerID' },
    { name: 'coachID', referencedColumnName: 'coachID' },
  ])
  training: Training;
}
