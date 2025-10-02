import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { UseCaseProxy } from '../usecases-proxy/usecases-proxy';
import { UsecasesProxyModule } from '../usecases-proxy/usecases-proxy.module';
import { CategoryUseCases } from 'src/use-cases/category.usecases';
import { CategoryPresenter } from 'src/domain/models/category/presenters/category.presenter';
import { CreateCategoryDTO } from 'src/domain/models/category/dtos/create-category.dto';
import { UpdateCategoryDTO } from 'src/domain/models/category/dtos/update-category.dto';
import { ApiOkResponseList } from '../common/swagger/api-ok-response-list.swagger';
import { AuthGuard } from '../common/guards/auth.guard';
import { AccountRole } from 'src/domain/entities/enums/account-role.enum';
import { Roles } from '../common/decorators/auth-roles.decorator';
import { RoleGuard } from '../common/guards/role.guard';

@ApiTags('Category')
@ApiBearerAuth()
@Controller('category')
export class CategoryController {
  constructor(
    @Inject(UsecasesProxyModule.CATEGORY_USECASES_PROXY)
    private readonly categoryUseCases: UseCaseProxy<CategoryUseCases>,
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
  @ApiOkResponseList(CategoryPresenter)
  fetchAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filter') filter?: Record<string, any>,
    @Query('search') search?: string,
  ) {
    return this.categoryUseCases
      .getInstance()
      .findAll(page, limit, filter, search);
  }

  @Get('count')
  fetchCount() {
    return this.categoryUseCases.getInstance().count();
  }

  @Get('fetchOne')
  @ApiResponse({ type: CategoryPresenter })
  fetchOne(@Query('id') id: number) {
    return this.categoryUseCases.getInstance().findOneById(id);
  }

  @Post('create')
  @ApiResponse({ type: CategoryPresenter })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(AccountRole.SUPER_ADMIN, AccountRole.GYM_ADMIN)
  create(@Body() categoryDto: CreateCategoryDTO) {
    return this.categoryUseCases.getInstance().create(categoryDto);
  }

  @Put('update/:id')
  @ApiResponse({ type: CategoryPresenter })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(AccountRole.SUPER_ADMIN, AccountRole.GYM_ADMIN)
  update(@Param('id') id: number, @Body() categoryDto: UpdateCategoryDTO) {
    return this.categoryUseCases.getInstance().update(id, categoryDto);
  }
}
