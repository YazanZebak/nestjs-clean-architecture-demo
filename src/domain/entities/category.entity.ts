import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Coach } from './coach.entity';

@Entity({ name: 'category' })
export class Category {
  @PrimaryGeneratedColumn({ name: 'categoryID' })
  categoryID: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  icon?: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  @OneToMany(() => Coach, (coach) => coach.category)
  coaches: Coach[];
}
