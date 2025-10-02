import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { MuscleName } from './enums/muscle-name.enum';

@Entity({ name: 'exercise' })
export class Exercise {
  @PrimaryGeneratedColumn({ name: 'exerciseID' })
  exerciseID: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ nullable: true })
  video?: string;

  @Column({ type: 'enum', enum: MuscleName })
  muscle: MuscleName;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}
