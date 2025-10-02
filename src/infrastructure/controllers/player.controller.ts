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
import { PlayerUseCases } from 'src/use-cases/player.usecases';
import { UseCaseProxy } from '../usecases-proxy/usecases-proxy';
import { UsecasesProxyModule } from '../usecases-proxy/usecases-proxy.module';
import { PlayerPresenter } from 'src/domain/models/player/presenters/player.presenter';
import { CreatePlayerDTO } from 'src/domain/models/player/dtos/create-player.dto';
import { UpdatePlayerDTO } from 'src/domain/models/player/dtos/update-player.dto';
import { ApiOkResponseList } from '../common/swagger/api-ok-response-list.swagger';
import { AuthGuard } from '../common/guards/auth.guard';
import { AccountRole } from 'src/domain/entities/enums/account-role.enum';
import { Roles } from '../common/decorators/auth-roles.decorator';
import { RoleGuard } from '../common/guards/role.guard';
import { Request } from 'express';

@ApiTags('Player')
@ApiBearerAuth()
@Controller('player')
export class PlayerController {
  constructor(
    @Inject(UsecasesProxyModule.PLAYER_USECASES_PROXY)
    private readonly playerUseCases: UseCaseProxy<PlayerUseCases>,
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
  @ApiOkResponseList(PlayerPresenter)
  fetchAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filter') filter?: Record<string, any>,
    @Query('search') search?: string,
  ) {
    return this.playerUseCases
      .getInstance()
      .findAll(page, limit, filter, search);
  }

  @Get('count')
  fetchCount() {
    return this.playerUseCases.getInstance().count();
  }

  @Get('fetchOne')
  @ApiResponse({ type: PlayerPresenter })
  fetchOne(@Query('id') id: number) {
    return this.playerUseCases.getInstance().findOneById(id);
  }

  @Get('fetchOneByAccount')
  @ApiResponse({ type: PlayerPresenter })
  fetchOneByAccount(@Query('accountID') id: number) {
    return this.playerUseCases.getInstance().findOneByAccount(id);
  }

  @Get('fetchMyProfile')
  @ApiResponse({ type: PlayerPresenter })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(AccountRole.PLAYER)
  fetchMyProfile(@Req() request: Request) {
    const id = request['user'].accountID;
    return this.playerUseCases.getInstance().findOneByAccount(id);
  }

  @Post('create')
  @ApiResponse({ type: PlayerPresenter })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(AccountRole.PLAYER, AccountRole.SUPER_ADMIN)
  create(@Body() playerDto: CreatePlayerDTO) {
    return this.playerUseCases.getInstance().create(playerDto);
  }

  @Put('update/:id')
  @ApiResponse({ type: PlayerPresenter })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(AccountRole.PLAYER, AccountRole.SUPER_ADMIN)
  update(@Param('id') id: number, @Body() playerDto: UpdatePlayerDTO) {
    return this.playerUseCases.getInstance().update(id, playerDto);
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(AccountRole.PLAYER, AccountRole.SUPER_ADMIN)
  delete(@Param('id') id: number) {
    return this.playerUseCases.getInstance().delete(id);
  }

  @Get('statistics')
  statistics(@Query('start') start: Date, @Query('end') end: Date) {
    return this.playerUseCases.getInstance().statistics(start, end);
  }
}
