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
import { CreateDietDTO } from 'src/domain/models/diet/dtos/create-diet.dto';
import { UpdateDietDTO } from 'src/domain/models/diet/dtos/update-diet.dto';
import { DietPresenter } from 'src/domain/models/diet/presenters/diet.presenter';
import { DietUseCases } from 'src/use-cases/diet.usecases';
import { ApiOkResponseList } from '../common/swagger/api-ok-response-list.swagger';
import { UseCaseProxy } from '../usecases-proxy/usecases-proxy';
import { UsecasesProxyModule } from '../usecases-proxy/usecases-proxy.module';
import { AuthGuard } from '../common/guards/auth.guard';
import { AccountRole } from 'src/domain/entities/enums/account-role.enum';
import { Roles } from '../common/decorators/auth-roles.decorator';
import { RoleGuard } from '../common/guards/role.guard';

@ApiTags('Diet')
@ApiBearerAuth()
@Controller('diet')
export class DietController {
  constructor(
    @Inject(UsecasesProxyModule.DIET_USECASE_PROXY)
    private readonly dietUseCases: UseCaseProxy<DietUseCases>,
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
  @ApiOkResponseList(DietPresenter)
  @UseGuards(AuthGuard)
  fetchAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filter') filter?: Record<string, any>,
    @Query('search') search?: string,
  ) {
    return this.dietUseCases.getInstance().findAll(page, limit, filter, search);
  }

  @Get('count')
  @UseGuards(AuthGuard)
  fetchCount() {
    return this.dietUseCases.getInstance().count();
  }

  @Get('fetchOne')
  @ApiResponse({ type: DietPresenter })
  @UseGuards(AuthGuard)
  fetchOne(@Query('id') id: number) {
    return this.dietUseCases.getInstance().findOneById(id);
  }

  @Post('create')
  @ApiResponse({ type: DietPresenter })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(AccountRole.COACH)
  create(@Body() dietDto: CreateDietDTO) {
    return this.dietUseCases.getInstance().create(dietDto);
  }

  @Put('update/:id')
  @ApiResponse({ type: DietPresenter })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(AccountRole.COACH)
  update(@Param('id') id: number, @Body() dietDto: UpdateDietDTO) {
    return this.dietUseCases.getInstance().update(id, dietDto);
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(AccountRole.COACH)
  delete(@Param('id') id: number) {
    return this.dietUseCases.getInstance().delete(id);
  }
}
