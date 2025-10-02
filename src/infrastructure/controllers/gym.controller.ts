import { GymUseCases } from 'src/use-cases/gym.usecases';
import { UsecasesProxyModule } from '../usecases-proxy/usecases-proxy.module';
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
  Req,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CreateGymDTO } from 'src/domain/models/gym/dtos/create-gym.dto';
import { UpdateGymDTO } from 'src/domain/models/gym/dtos/update-gym.dto';
import { GymPresenter } from 'src/domain/models/gym/presenters/gym.presenter';
import { UseCaseProxy } from '../usecases-proxy/usecases-proxy';
import { ApiOkResponseList } from '../common/swagger/api-ok-response-list.swagger';
import { AuthGuard } from '../common/guards/auth.guard';
import { AccountRole } from 'src/domain/entities/enums/account-role.enum';
import { Roles } from '../common/decorators/auth-roles.decorator';
import { RoleGuard } from '../common/guards/role.guard';
import { Request } from 'express';

@ApiTags('Gym')
@ApiBearerAuth()
@Controller('gym')
export class GymController {
  constructor(
    @Inject(UsecasesProxyModule.GYM_USECASE_PROXY)
    private readonly gymUseCases: UseCaseProxy<GymUseCases>,
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
  @ApiOkResponseList(GymPresenter)
  fetchAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filter') filter?: Record<string, any>,
    @Query('search') search?: string,
  ) {
    return this.gymUseCases.getInstance().findAll(page, limit, filter, search);
  }

  @Get('count')
  fetchCount() {
    return this.gymUseCases.getInstance().count();
  }

  @Get('fetchOne')
  @ApiResponse({ type: GymPresenter })
  fetchOne(@Query('id') id: number) {
    return this.gymUseCases.getInstance().findOneById(id);
  }

  @Get('fetchOneByAccount')
  @ApiResponse({ type: GymPresenter })
  fetchOneByAccount(@Query('accountID') id: number) {
    return this.gymUseCases.getInstance().findOneByAccount(id);
  }

  @Get('fetchMyProfile')
  @ApiResponse({ type: GymPresenter })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(AccountRole.GYM_ADMIN)
  fetchMyProfile(@Req() request: Request) {
    const id = request['user'].accountID;
    return this.gymUseCases.getInstance().findOneByAccount(id);
  }

  @Post('create')
  @ApiResponse({ type: GymPresenter })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(AccountRole.GYM_ADMIN, AccountRole.SUPER_ADMIN)
  create(@Body() gymDto: CreateGymDTO) {
    return this.gymUseCases.getInstance().create(gymDto);
  }

  @Put('update/:id')
  @ApiResponse({ type: GymPresenter })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(AccountRole.GYM_ADMIN, AccountRole.SUPER_ADMIN)
  update(@Param('id') id: number, @Body() gymDto: UpdateGymDTO) {
    return this.gymUseCases.getInstance().update(id, gymDto);
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(AccountRole.GYM_ADMIN, AccountRole.SUPER_ADMIN)
  delete(@Param('id') id: number) {
    return this.gymUseCases.getInstance().delete(id);
  }

  @Get('statistics')
  statistics(@Query('start') start: Date, @Query('end') end: Date) {
    return this.gymUseCases.getInstance().statistics(start, end);
  }
}
