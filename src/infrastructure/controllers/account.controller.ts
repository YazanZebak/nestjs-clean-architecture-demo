import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDTO } from 'src/domain/models/account/dtos/login.dto';
import { UsecasesProxyModule } from 'src/infrastructure/usecases-proxy/usecases-proxy.module';
import { AccountUseCases } from 'src/use-cases/account.usecases';
import { CreateAccountDTO } from '../../domain/models/account/dtos/create-account.dto';
import { AuthPresenter } from 'src/domain/models/account/presenters/auth.presenter';
import { UseCaseProxy } from '../usecases-proxy/usecases-proxy';
import { AccountPresenter } from 'src/domain/models/account/presenters/account.presenter';
import { UpdateAccountDTO } from 'src/domain/models/account/dtos/update-account.dto';
import { ApiOkResponseList } from '../common/swagger/api-ok-response-list.swagger';
import { AuthGuard } from '../common/guards/auth.guard';
import { AccountRole } from 'src/domain/entities/enums/account-role.enum';
import { Roles } from '../common/decorators/auth-roles.decorator';
import { RoleGuard } from '../common/guards/role.guard';
import { Request } from 'express';

@ApiTags('Account')
@ApiBearerAuth()
@Controller('account')
export class AccountController {
  constructor(
    @Inject(UsecasesProxyModule.ACCOUNT_USECASES_PROXY)
    private readonly accountUseCases: UseCaseProxy<AccountUseCases>,
  ) {}

  @Post('login')
  @ApiResponse({ type: AuthPresenter })
  logIn(@Body() loginDto: LoginDTO) {
    return this.accountUseCases.getInstance().login(loginDto);
  }

  @Post('signup')
  @ApiResponse({ type: AuthPresenter })
  signUp(@Body() signupDto: CreateAccountDTO) {
    return this.accountUseCases.getInstance().signup(signupDto);
  }

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
  @ApiOkResponseList(AccountPresenter)
  fetchAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filter') filter?: Record<string, any>,
    @Query('search') search?: string,
  ) {
    return this.accountUseCases
      .getInstance()
      .findAll(page, limit, filter, search);
  }

  @Get('count')
  fetchCount() {
    return this.accountUseCases.getInstance().count();
  }

  @Get('fetchOne')
  @ApiResponse({ type: AccountPresenter })
  fetchOne(@Query('id') id: number) {
    return this.accountUseCases.getInstance().findOneById(id);
  }

  @Post('create')
  @ApiResponse({ type: AccountPresenter })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(AccountRole.SUPER_ADMIN)
  create(@Body() accountDto: CreateAccountDTO) {
    return this.accountUseCases.getInstance().create(accountDto);
  }

  @Put('update/:id')
  @ApiResponse({ type: AccountPresenter })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(AccountRole.SUPER_ADMIN)
  update(@Param('id') id: number, @Body() accountDto: UpdateAccountDTO) {
    return this.accountUseCases.getInstance().update(id, accountDto);
  }

  @Put('updateMyAccount')
  @ApiResponse({ type: AccountPresenter })
  @UseGuards(AuthGuard)
  updateMyAccount(
    @Req() request: Request,
    @Body() accountDto: UpdateAccountDTO,
  ) {
    const id = request['user'].accountID;
    return this.accountUseCases.getInstance().update(id, accountDto);
  }

  @Patch('activate/:id')
  @ApiResponse({ type: AccountPresenter })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(AccountRole.SUPER_ADMIN)
  activate(@Param('id') id: number) {
    return this.accountUseCases.getInstance().activate(id);
  }

  @Patch('deactivate/:id')
  @ApiResponse({ type: AccountPresenter })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(AccountRole.SUPER_ADMIN)
  deactivate(@Param('id') id: number) {
    return this.accountUseCases.getInstance().deactivate(id);
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard)
  delete(@Param('id') id: number) {
    return this.accountUseCases.getInstance().delete(id);
  }

  @Get('statistics')
  statistics(@Query('start') start: Date, @Query('end') end: Date) {
    return this.accountUseCases.getInstance().statistics(start, end);
  }
}
