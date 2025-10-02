import { Module } from '@nestjs/common';
import { AccountController } from './account.controller';
import { UsecasesProxyModule } from '../usecases-proxy/usecases-proxy.module';
import { JwtModule } from '../services/jwt/jwt.module';
import { MediaController } from './media.controller';
import { MulterConfigModule } from '../configuration/multer-config/multer-config.module';
import { PlayerController } from './player.controller';
import { CategoryController } from './category.controller';
import { CoachController } from './coach.controller';
import { GymController } from './gym.controller';
import { MembershipController } from './membership.controller';
import { EnrollmentController } from './enrollment.controller';
import { TrainingController } from './training.controller';
import { ExerciseController } from './exercise.controller';
import { ProgramController } from './program.controller';
import { DietController } from './diet.controller';
import { RatingController } from './rating.controller';
import { TransactionController } from './transaction.controller';
import { GlobalHelperService } from '../common/helpers/global-helper.service';

@Module({
  imports: [UsecasesProxyModule.register(), JwtModule, MulterConfigModule],
  controllers: [
    AccountController,
    CategoryController,
    CoachController,
    GymController,
    PlayerController,
    MembershipController,
    EnrollmentController,
    TrainingController,
    ExerciseController,
    ProgramController,
    DietController,
    RatingController,
    TransactionController,
    MediaController,
  ],
  providers: [GlobalHelperService],
})
export class ControllersModule {}
