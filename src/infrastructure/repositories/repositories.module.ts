import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from 'src/domain/entities/account.entity';
import { AccountRepository } from './account.repository';
import { TypeOrmConfigModule } from '../configuration/typeorm/typeorm.module';
import { MediaRepository } from './media.repository';
import { Media } from 'src/domain/entities/media.entity';
import { Player } from 'src/domain/entities/player.entity';
import { PlayerRepository } from './player.repository';
import { CategoryRepository } from './category.repository';
import { Category } from 'src/domain/entities/category.entity';
import { CoachRepository } from './coach.repository';
import { Coach } from 'src/domain/entities/coach.entity';
import { ExceptionsModule } from '../services/exceptions/exceptions.module';
import { Gym } from 'src/domain/entities/gym.entity';
import { GymRepository } from './gym.repository';
import { Membership } from 'src/domain/entities/membership.entity';
import { MembershipRepository } from './membership.repository';
import { EnrollmentRepository } from './enrollment.repository';
import { Enrollment } from 'src/domain/entities/enrollment.entity';
import { Training } from 'src/domain/entities/training.entity';
import { TrainingRepository } from './training.repository';
import { BcryptModule } from '../services/bcrypt/bcrypty.module';
import { Exercise } from 'src/domain/entities/exercise.entity';
import { ExerciseRepository } from './exercise.repository';
import { Program } from 'src/domain/entities/program.entity';
import { ProgramRepository } from './program.repository';
import { Diet } from 'src/domain/entities/diet.entity';
import { DietRepository } from './diet.repository';
import { RatingRepository } from './rating.repository';
import { Rating } from 'src/domain/entities/rating.entity';
import { Transaction } from 'src/domain/entities/transaction.entity';
import { TransactionRepository } from './transaction.repository';
import { PusherModule } from '../services/pusher/pusher.module';

@Module({
  imports: [
    TypeOrmConfigModule,
    TypeOrmModule.forFeature([
      Account,
      Media,
      Player,
      Coach,
      Category,
      Gym,
      Membership,
      Enrollment,
      Training,
      Exercise,
      Program,
      Diet,
      Rating,
      Transaction,
    ]),
    ExceptionsModule,
    BcryptModule,
    PusherModule,
  ],
  providers: [
    AccountRepository,
    MediaRepository,
    PlayerRepository,
    CoachRepository,
    CategoryRepository,
    GymRepository,
    MembershipRepository,
    EnrollmentRepository,
    TrainingRepository,
    ExerciseRepository,
    ProgramRepository,
    DietRepository,
    RatingRepository,
    TransactionRepository,
  ],
  exports: [
    AccountRepository,
    MediaRepository,
    PlayerRepository,
    CoachRepository,
    CategoryRepository,
    GymRepository,
    MembershipRepository,
    EnrollmentRepository,
    TrainingRepository,
    ExerciseRepository,
    ProgramRepository,
    DietRepository,
    RatingRepository,
    TransactionRepository,
  ],
})
export class RepositoriesModule {}
