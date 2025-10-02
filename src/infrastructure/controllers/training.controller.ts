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
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CreateTrainingDTO } from 'src/domain/models/training/dtos/create-training.dto';
import { UpdateTrainingDTO } from 'src/domain/models/training/dtos/update-training.dto';
import { TrainingPresenter } from 'src/domain/models/training/presenter/training.presenter';
import { TrainingUseCases } from 'src/use-cases/training.usecases';
import { ApiOkResponseList } from '../common/swagger/api-ok-response-list.swagger';
import { UseCaseProxy } from '../usecases-proxy/usecases-proxy';
import { UsecasesProxyModule } from '../usecases-proxy/usecases-proxy.module';
import { AuthGuard } from '../common/guards/auth.guard';
import { AccountRole } from 'src/domain/entities/enums/account-role.enum';
import { Roles } from '../common/decorators/auth-roles.decorator';
import { RoleGuard } from '../common/guards/role.guard';
import { Request } from 'express';
import { GlobalHelperService } from '../common/helpers/global-helper.service';

@ApiTags('Training')
@ApiBearerAuth()
@Controller('training')
export class TrainingController {
  constructor(
    @Inject(UsecasesProxyModule.TRAINING_USECASE_PROXY)
    private readonly trainingUseCases: UseCaseProxy<TrainingUseCases>,
    private readonly globalService: GlobalHelperService,
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
  @ApiOkResponseList(TrainingPresenter)
  fetchAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filter') filter?: Record<string, any>,
    @Query('search') search?: string,
  ) {
    return this.trainingUseCases
      .getInstance()
      .findAll(page, limit, filter, search);
  }

  @Get('count')
  fetchCount() {
    return this.trainingUseCases.getInstance().count();
  }

  @Get('fetchOne')
  @ApiResponse({ type: TrainingPresenter })
  fetchOne(@Query('id') id: number) {
    return this.trainingUseCases.getInstance().findOneById(id);
  }

  @Get('fetchMyTraining')
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
  @ApiOkResponseList(TrainingPresenter)
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(AccountRole.COACH, AccountRole.PLAYER)
  fetchMyTraining(
    @Req() request: Request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filter') filter?: Record<string, any>,
    @Query('search') search?: string,
  ) {
    filter = this.globalService.applyRoleBasedFilter(request, filter);
    return this.trainingUseCases
      .getInstance()
      .findAll(page, limit, filter, search);
  }

  @Post('create')
  @ApiResponse({ type: TrainingPresenter })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(AccountRole.PLAYER)
  create(@Body() trainingDto: CreateTrainingDTO) {
    return this.trainingUseCases.getInstance().create(trainingDto);
  }

  @Post('createFromGym')
  @ApiResponse({ type: TrainingPresenter })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(AccountRole.GYM_ADMIN)
  createFromGym(@Body() trainingDto: CreateTrainingDTO) {
    return this.trainingUseCases.getInstance().createFromGym(trainingDto);
  }

  @Put('update/:id')
  @ApiResponse({ type: TrainingPresenter })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(AccountRole.SUPER_ADMIN, AccountRole.PLAYER, AccountRole.COACH)
  update(@Param('id') id: number, @Body() trainingDto: UpdateTrainingDTO) {
    return this.trainingUseCases.getInstance().update(id, trainingDto);
  }

  @Patch('accept/:id')
  @ApiResponse({ type: TrainingPresenter })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(AccountRole.COACH)
  accept(@Param('id') id: number) {
    return this.trainingUseCases.getInstance().accept(id);
  }

  @Patch('reject/:id')
  @ApiResponse({ type: TrainingPresenter })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(AccountRole.PLAYER, AccountRole.COACH)
  reject(@Param('id') id: number) {
    return this.trainingUseCases.getInstance().reject(id);
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(AccountRole.SUPER_ADMIN, AccountRole.PLAYER, AccountRole.COACH)
  delete(@Param('id') id: number) {
    return this.trainingUseCases.getInstance().delete(id);
  }
}
