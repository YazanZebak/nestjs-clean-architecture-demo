import { MembershipUseCases } from 'src/use-cases/membership.usecases';
import { UsecasesProxyModule } from '../usecases-proxy/usecases-proxy.module';
import { MembershipPresenter } from 'src/domain/models/membership/presenters/membership.presenter';
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
import { CreateMembershipDTO } from 'src/domain/models/membership/dtos/create-membership.dto';
import { UpdateMembershipDTO } from 'src/domain/models/membership/dtos/update-membership.dto';
import { UseCaseProxy } from '../usecases-proxy/usecases-proxy';
import { ApiOkResponseList } from '../common/swagger/api-ok-response-list.swagger';
import { AuthGuard } from '../common/guards/auth.guard';
import { AccountRole } from 'src/domain/entities/enums/account-role.enum';
import { Roles } from '../common/decorators/auth-roles.decorator';
import { RoleGuard } from '../common/guards/role.guard';
import { GlobalHelperService } from '../common/helpers/global-helper.service';
import { Request } from 'express';

@ApiTags('Membership')
@ApiBearerAuth()
@Controller('membership')
export class MembershipController {
  constructor(
    @Inject(UsecasesProxyModule.MEMBERSHIP_USECASE_PROXY)
    private readonly membershipUseCases: UseCaseProxy<MembershipUseCases>,
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
  @ApiOkResponseList(MembershipPresenter)
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(AccountRole.GYM_ADMIN)
  fetchAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filter') filter?: Record<string, any>,
    @Query('search') search?: string,
  ) {
    return this.membershipUseCases
      .getInstance()
      .findAll(page, limit, filter, search);
  }

  @Get('count')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(AccountRole.GYM_ADMIN)
  fetchCount() {
    return this.membershipUseCases.getInstance().count();
  }

  @Get('fetchOne')
  @ApiResponse({ type: MembershipPresenter })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(AccountRole.GYM_ADMIN)
  fetchOne(@Query('id') id: number) {
    return this.membershipUseCases.getInstance().findOneById(id);
  }

  @Get('fetchMyMemberships')
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
  @ApiOkResponseList(MembershipPresenter)
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(AccountRole.PLAYER, AccountRole.GYM_ADMIN)
  fetchMyMembership(
    @Req() request: Request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filter') filter?: Record<string, any>,
    @Query('search') search?: string,
  ) {
    filter = this.globalService.applyRoleBasedFilter(request, filter);
    return this.membershipUseCases
      .getInstance()
      .findAll(page, limit, filter, search);
  }

  @Post('create')
  @ApiResponse({ type: MembershipPresenter })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(AccountRole.GYM_ADMIN)
  create(@Body() membershipDto: CreateMembershipDTO) {
    return this.membershipUseCases.getInstance().create(membershipDto);
  }

  @Put('update/:id')
  @ApiResponse({ type: MembershipPresenter })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(AccountRole.GYM_ADMIN)
  update(@Param('id') id: number, @Body() membershipDto: UpdateMembershipDTO) {
    return this.membershipUseCases.getInstance().update(id, membershipDto);
  }

  @Patch('activate/:id')
  @ApiResponse({ type: MembershipPresenter })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(AccountRole.GYM_ADMIN)
  activate(@Param('id') id: number) {
    return this.membershipUseCases.getInstance().activate(id);
  }

  @Patch('deactivate/:id')
  @ApiResponse({ type: MembershipPresenter })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(AccountRole.GYM_ADMIN)
  deactivate(@Param('id') id: number) {
    return this.membershipUseCases.getInstance().deactivate(id);
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(AccountRole.GYM_ADMIN)
  delete(@Param('id') id: number) {
    return this.membershipUseCases.getInstance().delete(id);
  }

  @Get('statistics')
  statistics(@Query('start') start: Date, @Query('end') end: Date) {
    return this.membershipUseCases.getInstance().statistics(start, end);
  }
}
