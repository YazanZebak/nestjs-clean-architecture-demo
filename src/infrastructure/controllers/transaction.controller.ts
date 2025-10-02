import {
  Controller,
  Inject,
  Get,
  Query,
  Post,
  Body,
  Put,
  Param,
  Patch,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CreateTransactionDTO } from 'src/domain/models/transaction/dtos/create-transaction.dto';
import { UpdateTransactionDTO } from 'src/domain/models/transaction/dtos/update-transaction.dto';
import { TransactionPresenter } from 'src/domain/models/transaction/presentation/transaction.presenter';
import { TransactionUseCases } from 'src/use-cases/transaction.usecases';
import { ApiOkResponseList } from '../common/swagger/api-ok-response-list.swagger';
import { UseCaseProxy } from '../usecases-proxy/usecases-proxy';
import { UsecasesProxyModule } from '../usecases-proxy/usecases-proxy.module';
import { AuthGuard } from '../common/guards/auth.guard';
import { AccountRole } from 'src/domain/entities/enums/account-role.enum';
import { Roles } from '../common/decorators/auth-roles.decorator';
import { RoleGuard } from '../common/guards/role.guard';

@ApiTags('Transaction')
@ApiBearerAuth()
@Controller('transaction')
export class TransactionController {
  constructor(
    @Inject(UsecasesProxyModule.TRANSACTION_USECASE_PROXY)
    private readonly transactionUseCases: UseCaseProxy<TransactionUseCases>,
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
  @ApiOkResponseList(TransactionPresenter)
  @UseGuards(AuthGuard)
  fetchAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filter') filter?: Record<string, any>,
    @Query('search') search?: string,
  ) {
    return this.transactionUseCases
      .getInstance()
      .findAll(page, limit, filter, search);
  }

  @Get('count')
  @UseGuards(AuthGuard)
  fetchCount() {
    return this.transactionUseCases.getInstance().count();
  }

  @Get('fetchOne')
  @ApiResponse({ type: TransactionPresenter })
  @UseGuards(AuthGuard)
  fetchOne(@Query('id') id: number) {
    return this.transactionUseCases.getInstance().findOneById(id);
  }

  @Post('create')
  @ApiResponse({ type: TransactionPresenter })
  @UseGuards(AuthGuard)
  create(@Body() transactionDto: CreateTransactionDTO) {
    return this.transactionUseCases.getInstance().create(transactionDto);
  }

  @Put('update/:id')
  @ApiResponse({ type: TransactionPresenter })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(AccountRole.SUPER_ADMIN)
  update(
    @Param('id') id: number,
    @Body() transactionDto: UpdateTransactionDTO,
  ) {
    return this.transactionUseCases.getInstance().update(id, transactionDto);
  }

  @Patch('accept/:id')
  @ApiResponse({ type: TransactionPresenter })
  @UseGuards(AuthGuard)
  accept(@Param('id') id: number) {
    return this.transactionUseCases.getInstance().accept(id);
  }

  @Patch('reject/:id')
  @ApiResponse({ type: TransactionPresenter })
  @UseGuards(AuthGuard)
  reject(@Param('id') id: number) {
    return this.transactionUseCases.getInstance().reject(id);
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(AccountRole.SUPER_ADMIN)
  delete(@Param('id') id: number) {
    return this.transactionUseCases.getInstance().delete(id);
  }
}
