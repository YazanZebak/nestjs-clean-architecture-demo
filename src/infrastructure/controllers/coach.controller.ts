import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { CreateCoachDTO } from 'src/domain/models/coach/dtos/create-coach.dto';
import { UpdateCoachDTO } from 'src/domain/models/coach/dtos/update-coach.dto';
import { CoachPresenter } from 'src/domain/models/coach/presenters/coach.presenter';
import { CoachUseCases } from 'src/use-cases/coach.usecases';
import { UseCaseProxy } from '../usecases-proxy/usecases-proxy';
import { UsecasesProxyModule } from '../usecases-proxy/usecases-proxy.module';
import { ApiOkResponseList } from '../common/swagger/api-ok-response-list.swagger';
import { AuthGuard } from '../common/guards/auth.guard';
import { AccountRole } from 'src/domain/entities/enums/account-role.enum';
import { Roles } from '../common/decorators/auth-roles.decorator';
import { RoleGuard } from '../common/guards/role.guard';
import { Request } from 'express';

@ApiTags('Coach')
@ApiBearerAuth()
@Controller('coach')
export class CoachController {
  constructor(
    @Inject(UsecasesProxyModule.COACH_USECASES_PROXY)
    private readonly coachUseCases: UseCaseProxy<CoachUseCases>,
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
  @ApiOkResponseList(CoachPresenter)
  fetchAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filter') filter?: Record<string, any>,
    @Query('search') search?: string,
  ) {
    return this.coachUseCases
      .getInstance()
      .findAll(page, limit, filter, search);
  }

  @Get('count')
  fetchCount() {
    return this.coachUseCases.getInstance().count();
  }

  @Get('fetchOne')
  @ApiResponse({ type: CoachPresenter })
  fetchOne(@Query('id') id: number) {
    return this.coachUseCases.getInstance().findOneById(id);
  }

  @Get('fetchOneByAccount')
  @ApiResponse({ type: CoachPresenter })
  fetchOneByAccount(@Query('accountID') id: number) {
    return this.coachUseCases.getInstance().findOneByAccount(id);
  }

  @Get('fetchMyProfile')
  @ApiResponse({ type: CoachPresenter })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(AccountRole.COACH)
  fetchMyProfile(@Req() request: Request) {
    const id = request['user'].accountID;
    return this.coachUseCases.getInstance().findOneByAccount(id);
  }

  @Post('create')
  @ApiResponse({ type: CoachPresenter })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(AccountRole.COACH, AccountRole.SUPER_ADMIN)
  create(@Body() coachDto: CreateCoachDTO) {
    return this.coachUseCases.getInstance().create(coachDto);
  }

  @Put('update/:id')
  @ApiResponse({ type: CoachPresenter })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(AccountRole.COACH, AccountRole.SUPER_ADMIN)
  update(@Param('id') id: number, @Body() coachDto: UpdateCoachDTO) {
    return this.coachUseCases.getInstance().update(id, coachDto);
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(AccountRole.COACH, AccountRole.SUPER_ADMIN)
  delete(@Param('id') id: number) {
    return this.coachUseCases.getInstance().delete(id);
  }

  @Get('statistics')
  statistics(@Query('start') start: Date, @Query('end') end: Date) {
    return this.coachUseCases.getInstance().statistics(start, end);
  }
}
