import {
  Check,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Training } from './training.entity';

@Entity({ name: 'rating' })
export class Rating {
  @PrimaryGeneratedColumn({ name: 'ratingID' })
  ratingID: number;

  @Column({ type: 'decimal' })
  @Check(`"value" >= 0 AND "value" <= 5`)
  value: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  @ManyToOne(() => Training, (training) => training.ratings)
  @JoinColumn([
    { name: 'playerID', referencedColumnName: 'playerID' },
    { name: 'coachID', referencedColumnName: 'coachID' },
  ])
  training: Training;
}
