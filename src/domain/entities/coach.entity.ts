import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Player } from './player.entity';
import { Gym } from './gym.entity';
import { Category } from './category.entity';
import { Account } from './account.entity';
import { Gender } from './enums/gender.enum';
import { Enrollment } from './enrollment.entity';
import { Training } from './training.entity';

@Entity({ name: 'coach' })
export class Coach {
  @PrimaryGeneratedColumn({ name: 'coachID' })
  coachID: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  age: number;

  @Column({ type: 'enum', enum: Gender })
  gender: Gender;

  @Column()
  yearsOfExperience: number;

  @Column({ nullable: true })
  certificatePath?: string;

  @Column({ nullable: true })
  about?: string;

  @Column({ nullable: true })
  price?: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  @OneToOne(() => Account, (account) => account.coach, {
    eager: true,
    cascade: ['soft-remove'],
  })
  @JoinColumn({ name: 'accountID' })
  account: Account;

  @ManyToOne(() => Category, (category) => category.coaches)
  @JoinColumn({ name: 'categoryID' })
  category: Category;

  @ManyToMany(() => Gym, (gym) => gym.coaches)
  @JoinTable({
    name: 'enrollment',
    joinColumn: {
      name: 'coachID',
      referencedColumnName: 'coachID',
    },
    inverseJoinColumn: {
      name: 'gymID',
      referencedColumnName: 'gymID',
    },
  })
  gyms: Gym[];

  @OneToMany(() => Enrollment, (enrollment) => enrollment.coach)
  enrollments: Enrollment[];

  @ManyToMany(() => Player, (player) => player.gyms)
  players: Player[];

  @OneToMany(() => Training, (training) => training.coach)
  trainings: Training[];
}
