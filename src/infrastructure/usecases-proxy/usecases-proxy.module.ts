import { DynamicModule, Module } from '@nestjs/common';

import { UseCaseProxy } from './usecases-proxy';
import { LoggerModule } from '../services/logger/logger.module';
import { JwtModule } from '../services/jwt/jwt.module';
import { BcryptModule } from '../services/bcrypt/bcrypty.module';
import { EnvironmentConfigModule } from '../configuration/environment-config/environment-config.module';
import { RepositoriesModule } from '../repositories/repositories.module';
import { ExceptionsModule } from '../services/exceptions/exceptions.module';
import { JwtTokenService } from '../services/jwt/jwt.service';
import { BcryptService } from '../services/bcrypt/bcrypt.service';
import { AccountRepository } from '../repositories/account.repository';
import { ExceptionsService } from '../services/exceptions/exceptions.service';
import { AccountUseCases } from 'src/use-cases/account.usecases';
import { MediaUseCases } from 'src/use-cases/media.usecases';
import { MediaRepository } from '../repositories/media.repository';
import { StorageService } from '../services/storage/storage.service';
import { StorageModule } from '../services/storage/storage.module';
import { MulterConfigModule } from '../configuration/multer-config/multer-config.module';
import { PlayerUseCases } from 'src/use-cases/player.usecases';
import { PlayerRepository } from '../repositories/player.repository';
import { CategoryUseCases } from 'src/use-cases/category.usecases';
import { CategoryRepository } from '../repositories/category.repository';
import { CoachRepository } from '../repositories/coach.repository';
import { CoachUseCases } from 'src/use-cases/coach.usecases';
import { GymUseCases } from 'src/use-cases/gym.usecases';
import { GymRepository } from '../repositories/gym.repository';
import { MembershipRepository } from '../repositories/membership.repository';
import { MembershipUseCases } from 'src/use-cases/membership.usecases';
import { EnrollmentRepository } from '../repositories/enrollment.repository';
import { EnrollmentUseCases } from 'src/use-cases/enrollment.usecases';
import { TrainingRepository } from '../repositories/training.repository';
import { TrainingUseCases } from 'src/use-cases/training.usecases';
import { ExerciseUseCases } from 'src/use-cases/exercise.usecases';
import { ExerciseRepository } from '../repositories/exercise.repository';
import { ProgramUseCases } from 'src/use-cases/program.usecases';
import { ProgramRepository } from '../repositories/program.repository';
import { DietUseCases } from 'src/use-cases/diet.usecases';
import { DietRepository } from '../repositories/diet.repository';
import { RatingRepository } from '../repositories/rating.repository';
import { RatingUseCases } from 'src/use-cases/rating.usecases';
import { TransactionRepository } from '../repositories/transaction.repository';
import { TransactionUseCases } from 'src/use-cases/transaction.usecases';

@Module({
  imports: [
    LoggerModule,
    JwtModule,
    BcryptModule,
    EnvironmentConfigModule,
    RepositoriesModule,
    ExceptionsModule,
    StorageModule,
    MulterConfigModule,
  ],
})
export class UsecasesProxyModule {
  static ACCOUNT_USECASES_PROXY = 'AccountUseCasesProxy';
  static MEDIA_USECASES_PROXY = 'MediaUseCasesProxy';
  static PLAYER_USECASES_PROXY = 'PlayerUseCasesProxy';
  static CATEGORY_USECASES_PROXY = 'CategoryUseCasesProxy';
  static COACH_USECASES_PROXY = 'CoachUseCasesProxy';
  static GYM_USECASE_PROXY = 'GymUseCasesProxy';
  static MEMBERSHIP_USECASE_PROXY = 'MembershipUseCasesProxy';
  static ENROLLMENT_USECASE_PROXY = 'EnrollmentUseCasesProxy';
  static TRAINING_USECASE_PROXY = 'TrainingUseCasesProxy';
  static EXERCISE_USECASE_PROXY = 'ExerciseUseCasesProxy';
  static PROGRAM_USECASE_PROXY = 'ProgramUseCasesProxy';
  static DIET_USECASE_PROXY = 'DietUseCasesProxy';
  static RATING_USECASE_PROXY = 'RatingUseCasesProxy';
  static TRANSACTION_USECASE_PROXY = 'TransactionUseCasesProxy';

  static register(): DynamicModule {
    return {
      module: UsecasesProxyModule,
      providers: [
        {
          inject: [
            AccountRepository,
            PlayerRepository,
            CoachRepository,
            GymRepository,
            JwtTokenService,
            BcryptService,
            ExceptionsService,
          ],
          provide: UsecasesProxyModule.ACCOUNT_USECASES_PROXY,
          useFactory: (
            accountRepository: AccountRepository,
            playerRepository: PlayerRepository,
            coachRepository: CoachRepository,
            gymRepository: GymRepository,
            jwtTokenService: JwtTokenService,
            bcryptService: BcryptService,
            exceptionService: ExceptionsService,
          ) =>
            new UseCaseProxy(
              new AccountUseCases(
                accountRepository,
                playerRepository,
                coachRepository,
                gymRepository,
                jwtTokenService,
                bcryptService,
                exceptionService,
              ),
            ),
        },
        {
          inject: [MediaRepository, ExceptionsService, StorageService],
          provide: UsecasesProxyModule.MEDIA_USECASES_PROXY,
          useFactory: (
            mediaRepository: MediaRepository,
            exceptionService: ExceptionsService,
            storageService: StorageService,
          ) =>
            new UseCaseProxy(
              new MediaUseCases(
                mediaRepository,
                exceptionService,
                storageService,
              ),
            ),
        },
        {
          inject: [AccountRepository, PlayerRepository, ExceptionsService],
          provide: UsecasesProxyModule.PLAYER_USECASES_PROXY,
          useFactory: (
            accountRepository: AccountRepository,
            playerRepository: PlayerRepository,
            exceptionService: ExceptionsService,
          ) =>
            new UseCaseProxy(
              new PlayerUseCases(
                accountRepository,
                playerRepository,
                exceptionService,
              ),
            ),
        },
        {
          inject: [CategoryRepository, ExceptionsService],
          provide: UsecasesProxyModule.CATEGORY_USECASES_PROXY,
          useFactory: (
            categoryRepository: CategoryRepository,
            exceptionService: ExceptionsService,
          ) =>
            new UseCaseProxy(
              new CategoryUseCases(categoryRepository, exceptionService),
            ),
        },
        {
          inject: [
            AccountRepository,
            CoachRepository,
            CategoryRepository,
            ExceptionsService,
          ],
          provide: UsecasesProxyModule.COACH_USECASES_PROXY,
          useFactory: (
            accountRepository: AccountRepository,
            coachRepository: CoachRepository,
            categoryRepository: CategoryRepository,
            exceptionService: ExceptionsService,
          ) =>
            new UseCaseProxy(
              new CoachUseCases(
                accountRepository,
                coachRepository,
                categoryRepository,
                exceptionService,
              ),
            ),
        },
        {
          inject: [AccountRepository, GymRepository, ExceptionsService],
          provide: UsecasesProxyModule.GYM_USECASE_PROXY,
          useFactory: (
            accountRepository: AccountRepository,
            gymRepository: GymRepository,
            exceptionService: ExceptionsService,
          ) =>
            new UseCaseProxy(
              new GymUseCases(
                accountRepository,
                gymRepository,
                exceptionService,
              ),
            ),
        },
        {
          inject: [
            MembershipRepository,
            GymRepository,
            PlayerRepository,
            ExceptionsService,
          ],
          provide: UsecasesProxyModule.MEMBERSHIP_USECASE_PROXY,
          useFactory: (
            membershipRepositroy: MembershipRepository,
            gymRepository: GymRepository,
            playerRepository: PlayerRepository,
            exceptionService: ExceptionsService,
          ) =>
            new UseCaseProxy(
              new MembershipUseCases(
                membershipRepositroy,
                gymRepository,
                playerRepository,
                exceptionService,
              ),
            ),
        },
        {
          inject: [
            EnrollmentRepository,
            GymRepository,
            CoachRepository,
            ExceptionsService,
          ],
          provide: UsecasesProxyModule.ENROLLMENT_USECASE_PROXY,
          useFactory: (
            enrollmentRepository: EnrollmentRepository,
            gymRepository: GymRepository,
            coachRepository: CoachRepository,
            exceptionService: ExceptionsService,
          ) =>
            new UseCaseProxy(
              new EnrollmentUseCases(
                enrollmentRepository,
                gymRepository,
                coachRepository,
                exceptionService,
              ),
            ),
        },
        {
          inject: [
            TrainingRepository,
            PlayerRepository,
            CoachRepository,
            ExceptionsService,
          ],
          provide: UsecasesProxyModule.TRAINING_USECASE_PROXY,
          useFactory: (
            trainingRepository: TrainingRepository,
            playerRepository: PlayerRepository,
            coachRepository: CoachRepository,
            exceptionService: ExceptionsService,
          ) =>
            new UseCaseProxy(
              new TrainingUseCases(
                trainingRepository,
                playerRepository,
                coachRepository,
                exceptionService,
              ),
            ),
        },
        {
          inject: [ExerciseRepository, ExceptionsService],
          provide: UsecasesProxyModule.EXERCISE_USECASE_PROXY,
          useFactory: (
            exerciseRepository: ExerciseRepository,
            exceptionService: ExceptionsService,
          ) =>
            new UseCaseProxy(
              new ExerciseUseCases(exerciseRepository, exceptionService),
            ),
        },
        {
          inject: [ProgramRepository, TrainingRepository, ExceptionsService],
          provide: UsecasesProxyModule.PROGRAM_USECASE_PROXY,
          useFactory: (
            programRepository: ProgramRepository,
            trainingRepository: TrainingRepository,
            exceptionService: ExceptionsService,
          ) =>
            new UseCaseProxy(
              new ProgramUseCases(
                programRepository,
                trainingRepository,
                exceptionService,
              ),
            ),
        },
        {
          inject: [DietRepository, TrainingRepository, ExceptionsService],
          provide: UsecasesProxyModule.DIET_USECASE_PROXY,
          useFactory: (
            dietRepository: DietRepository,
            trainingRepository: TrainingRepository,
            exceptionService: ExceptionsService,
          ) =>
            new UseCaseProxy(
              new DietUseCases(
                dietRepository,
                trainingRepository,
                exceptionService,
              ),
            ),
        },
        {
          inject: [RatingRepository, TrainingRepository, ExceptionsService],
          provide: UsecasesProxyModule.RATING_USECASE_PROXY,
          useFactory: (
            ratingRepository: RatingRepository,
            trainingRepository: TrainingRepository,
            exceptionService: ExceptionsService,
          ) =>
            new UseCaseProxy(
              new RatingUseCases(
                ratingRepository,
                trainingRepository,
                exceptionService,
              ),
            ),
        },
        {
          inject: [TransactionRepository, AccountRepository, ExceptionsService],
          provide: UsecasesProxyModule.TRANSACTION_USECASE_PROXY,
          useFactory: (
            transactionRepository: TransactionRepository,
            accountRepository: AccountRepository,
            exceptionService: ExceptionsService,
          ) =>
            new UseCaseProxy(
              new TransactionUseCases(
                transactionRepository,
                accountRepository,
                exceptionService,
              ),
            ),
        },
      ],
      exports: [
        UsecasesProxyModule.ACCOUNT_USECASES_PROXY,
        UsecasesProxyModule.MEDIA_USECASES_PROXY,
        UsecasesProxyModule.PLAYER_USECASES_PROXY,
        UsecasesProxyModule.CATEGORY_USECASES_PROXY,
        UsecasesProxyModule.COACH_USECASES_PROXY,
        UsecasesProxyModule.GYM_USECASE_PROXY,
        UsecasesProxyModule.MEMBERSHIP_USECASE_PROXY,
        UsecasesProxyModule.ENROLLMENT_USECASE_PROXY,
        UsecasesProxyModule.TRAINING_USECASE_PROXY,
        UsecasesProxyModule.EXERCISE_USECASE_PROXY,
        UsecasesProxyModule.PROGRAM_USECASE_PROXY,
        UsecasesProxyModule.DIET_USECASE_PROXY,
        UsecasesProxyModule.RATING_USECASE_PROXY,
        UsecasesProxyModule.TRANSACTION_USECASE_PROXY,
      ],
    };
  }
}
