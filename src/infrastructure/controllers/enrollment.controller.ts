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
import { CreateEnrollmentDTO } from 'src/domain/models/enrollment/dtos/create-enrollment.dto';
import { UpdateEnrollmentDTO } from 'src/domain/models/enrollment/dtos/update-enrollment.dto';
import { EnrollmentPresenter } from 'src/domain/models/enrollment/presenters/enrollment.presenter';
import { EnrollmentUseCases } from 'src/use-cases/enrollment.usecases';
import { ApiOkResponseList } from '../common/swagger/api-ok-response-list.swagger';
import { UseCaseProxy } from '../usecases-proxy/usecases-proxy';
import { UsecasesProxyModule } from '../usecases-proxy/usecases-proxy.module';
import { AuthGuard } from '../common/guards/auth.guard';
import { RoleGuard } from '../common/guards/role.guard';
import { AccountRole } from 'src/domain/entities/enums/account-role.enum';
import { Roles } from '../common/decorators/auth-roles.decorator';
import { Request } from 'express';
import { GlobalHelperService } from '../common/helpers/global-helper.service';

@ApiTags('Enrollment')
@ApiBearerAuth()
@Controller('enrollment')
export class EnrollmentController {
  constructor(
    @Inject(UsecasesProxyModule.ENROLLMENT_USECASE_PROXY)
    private readonly enrollmentUseCases: UseCaseProxy<EnrollmentUseCases>,
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
  @ApiOkResponseList(EnrollmentPresenter)
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(AccountRole.GYM_ADMIN)
  fetchAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filter') filter?: Record<string, any>,
    @Query('search') search?: string,
  ) {
    return this.enrollmentUseCases
      .getInstance()
      .findAll(page, limit, filter, search);
  }

  @Get('count')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(AccountRole.GYM_ADMIN)
  fetchCount() {
    return this.enrollmentUseCases.getInstance().count();
  }

  @Get('fetchOne')
  @ApiResponse({ type: EnrollmentPresenter })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(AccountRole.GYM_ADMIN)
  fetchOne(@Query('id') id: number) {
    return this.enrollmentUseCases.getInstance().findOneById(id);
  }

  @Get('fetchMyEnrollments')
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
  @ApiOkResponseList(EnrollmentPresenter)
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(AccountRole.COACH, AccountRole.GYM_ADMIN)
  fetchMyEnrollments(
    @Req() request: Request,
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filter') filter?: Record<string, any>,
    @Query('search') search?: string,
  ) {
    filter = this.globalService.applyRoleBasedFilter(request, filter);
    return this.enrollmentUseCases
      .getInstance()
      .findAll(page, limit, filter, search);
  }

  @Post('create')
  @ApiResponse({ type: EnrollmentPresenter })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(AccountRole.GYM_ADMIN)
  create(@Body() enrollmentDto: CreateEnrollmentDTO) {
    return this.enrollmentUseCases.getInstance().create(enrollmentDto);
  }

  @Put('update/:id')
  @ApiResponse({ type: EnrollmentPresenter })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(AccountRole.GYM_ADMIN)
  update(@Param('id') id: number, @Body() enrollmentDto: UpdateEnrollmentDTO) {
    return this.enrollmentUseCases.getInstance().update(id, enrollmentDto);
  }

  @Patch('activate/:id')
  @ApiResponse({ type: EnrollmentPresenter })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(AccountRole.GYM_ADMIN)
  activate(@Param('id') id: number) {
    return this.enrollmentUseCases.getInstance().activate(id);
  }

  @Patch('deactivate/:id')
  @ApiResponse({ type: EnrollmentPresenter })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(AccountRole.GYM_ADMIN)
  deactivate(@Param('id') id: number) {
    return this.enrollmentUseCases.getInstance().deactivate(id);
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(AccountRole.GYM_ADMIN)
  delete(@Param('id') id: number) {
    return this.enrollmentUseCases.getInstance().delete(id);
  }

  @Get('statistics')
  statistics(@Query('start') start: Date, @Query('end') end: Date) {
    return this.enrollmentUseCases.getInstance().statistics(start, end);
  }
}
