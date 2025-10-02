import {
  Controller,
  Inject,
  Get,
  Query,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CreateExerciseDTO } from 'src/domain/models/exercise/dtos/create-exercise.dto';
import { UpdateExerciseDTO } from 'src/domain/models/exercise/dtos/update-exercise.dto';
import { ExercisePresenter } from 'src/domain/models/exercise/presenters/exercise.presenter';
import { ExerciseUseCases } from 'src/use-cases/exercise.usecases';
import { ApiOkResponseList } from '../common/swagger/api-ok-response-list.swagger';
import { UseCaseProxy } from '../usecases-proxy/usecases-proxy';
import { UsecasesProxyModule } from '../usecases-proxy/usecases-proxy.module';
import { AuthGuard } from '../common/guards/auth.guard';
import { AccountRole } from 'src/domain/entities/enums/account-role.enum';
import { Roles } from '../common/decorators/auth-roles.decorator';
import { RoleGuard } from '../common/guards/role.guard';

@ApiTags('Exercise')
@ApiBearerAuth()
@Controller('exercise')
export class ExerciseController {
  constructor(
    @Inject(UsecasesProxyModule.EXERCISE_USECASE_PROXY)
    private readonly exerciseUseCases: UseCaseProxy<ExerciseUseCases>,
  ) {}

  @Get('fetchAll')
  @ApiQuery({
    name: 'page',
    required: true,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: true,
    type: Number,
  })
  @ApiQuery({
    name: 'filter',
    required: false,
    schema: {
      type: 'object',
      properties: {
        filter: {
          type: 'object',
        },
      },
    },
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
  })
  @ApiOkResponseList(ExercisePresenter)
  fetchAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filter') filter?: Record<string, any>,
    @Query('search') search?: string,
  ) {
    return this.exerciseUseCases
      .getInstance()
      .findAll(page, limit, filter, search);
  }

  @Get('count')
  fetchCount() {
    return this.exerciseUseCases.getInstance().count();
  }

  @Get('fetchOne')
  @ApiResponse({ type: ExercisePresenter })
  fetchOne(@Query('id') id: number) {
    return this.exerciseUseCases.getInstance().findOneById(id);
  }

  @Post('create')
  @ApiResponse({ type: ExercisePresenter })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(AccountRole.COACH, AccountRole.SUPER_ADMIN, AccountRole.GYM_ADMIN)
  create(@Body() exerciseDto: CreateExerciseDTO) {
    return this.exerciseUseCases.getInstance().create(exerciseDto);
  }

  @Put('update/:id')
  @ApiResponse({ type: ExercisePresenter })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(AccountRole.SUPER_ADMIN)
  update(@Param('id') id: number, @Body() exerciseDto: UpdateExerciseDTO) {
    return this.exerciseUseCases.getInstance().update(id, exerciseDto);
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(AccountRole.SUPER_ADMIN)
  delete(@Param('id') id: number) {
    return this.exerciseUseCases.getInstance().delete(id);
  }
}
