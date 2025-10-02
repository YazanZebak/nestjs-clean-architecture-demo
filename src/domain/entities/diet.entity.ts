import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  DeleteDateColumn,
  JoinColumn,
} from 'typeorm';
import { MealItem } from './interfaces/meal-item.interface';
import { Training } from './training.entity';

@Entity({ name: 'diet' })
export class Diet {
  @PrimaryGeneratedColumn({ name: 'dietID' })
  dietID: number;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  description?: string;

  @Column('jsonb')
  days: { day: string; meals: MealItem[] }[];

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => Training, (training) => training.diets)
  @JoinColumn([
    { name: 'playerID', referencedColumnName: 'playerID' },
    { name: 'coachID', referencedColumnName: 'coachID' },
  ])
  training: Training;
}
