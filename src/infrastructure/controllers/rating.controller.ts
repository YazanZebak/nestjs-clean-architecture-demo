import {
  Controller,
  Inject,
  Get,
  Query,
  Post,
  Body,
  Put,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CreateRatingDTO } from 'src/domain/models/rating/dtos/create-rating.dto';
import { UpdateRatingDTO } from 'src/domain/models/rating/dtos/update-rating.dto';
import { RatingPresenter } from 'src/domain/models/rating/presenter/rating.presenter';
import { RatingUseCases } from 'src/use-cases/rating.usecases';
import { ApiOkResponseList } from '../common/swagger/api-ok-response-list.swagger';
import { UseCaseProxy } from '../usecases-proxy/usecases-proxy';
import { UsecasesProxyModule } from '../usecases-proxy/usecases-proxy.module';
import { AuthGuard } from '../common/guards/auth.guard';
import { AccountRole } from 'src/domain/entities/enums/account-role.enum';
import { Roles } from '../common/decorators/auth-roles.decorator';
import { RoleGuard } from '../common/guards/role.guard';

@ApiTags('Rating')
@ApiBearerAuth()
@Controller('rating')
export class RatingController {
  constructor(
    @Inject(UsecasesProxyModule.RATING_USECASE_PROXY)
    private readonly ratingUseCases: UseCaseProxy<RatingUseCases>,
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
  @ApiOkResponseList(RatingPresenter)
  fetchAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filter') filter?: Record<string, any>,
    @Query('search') search?: string,
  ) {
    return this.ratingUseCases
      .getInstance()
      .findAll(page, limit, filter, search);
  }

  @Get('count')
  fetchCount() {
    return this.ratingUseCases.getInstance().count();
  }

  @Get('fetchOne')
  @ApiResponse({ type: RatingPresenter })
  fetchOne(@Query('id') id: number) {
    return this.ratingUseCases.getInstance().findOneById(id);
  }

  @Post('create')
  @ApiResponse({ type: RatingPresenter })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(AccountRole.SUPER_ADMIN, AccountRole.PLAYER)
  create(@Body() ratingDto: CreateRatingDTO) {
    return this.ratingUseCases.getInstance().create(ratingDto);
  }

  @Put('update/:id')
  @ApiResponse({ type: RatingPresenter })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(AccountRole.SUPER_ADMIN, AccountRole.PLAYER)
  update(@Param('id') id: number, @Body() ratingDto: UpdateRatingDTO) {
    return this.ratingUseCases.getInstance().update(id, ratingDto);
  }
}
