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
import { CreateProgramDTO } from 'src/domain/models/program/dtos/create-program.dto';
import { UpdateProgramDTO } from 'src/domain/models/program/dtos/update-program.dto';
import { ProgramPresenter } from 'src/domain/models/program/presenters/program.presenter';
import { ProgramUseCases } from 'src/use-cases/program.usecases';
import { ApiOkResponseList } from '../common/swagger/api-ok-response-list.swagger';
import { UseCaseProxy } from '../usecases-proxy/usecases-proxy';
import { UsecasesProxyModule } from '../usecases-proxy/usecases-proxy.module';
import { AuthGuard } from '../common/guards/auth.guard';
import { AccountRole } from 'src/domain/entities/enums/account-role.enum';
import { Roles } from '../common/decorators/auth-roles.decorator';
import { RoleGuard } from '../common/guards/role.guard';

@ApiTags('Program')
@ApiBearerAuth()
@Controller('program')
export class ProgramController {
  constructor(
    @Inject(UsecasesProxyModule.PROGRAM_USECASE_PROXY)
    private readonly programUseCases: UseCaseProxy<ProgramUseCases>,
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
  @ApiOkResponseList(ProgramPresenter)
  @UseGuards(AuthGuard)
  fetchAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('filter') filter?: Record<string, any>,
    @Query('search') search?: string,
  ) {
    return this.programUseCases
      .getInstance()
      .findAll(page, limit, filter, search);
  }

  @Get('count')
  @UseGuards(AuthGuard)
  fetchCount() {
    return this.programUseCases.getInstance().count();
  }

  @Get('fetchOne')
  @ApiResponse({ type: ProgramPresenter })
  @UseGuards(AuthGuard)
  fetchOne(@Query('id') id: number) {
    return this.programUseCases.getInstance().findOneById(id);
  }

  @Post('create')
  @ApiResponse({ type: ProgramPresenter })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(AccountRole.COACH)
  create(@Body() programDto: CreateProgramDTO) {
    return this.programUseCases.getInstance().create(programDto);
  }

  @Put('update/:id')
  @ApiResponse({ type: ProgramPresenter })
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(AccountRole.COACH)
  update(@Param('id') id: number, @Body() programDto: UpdateProgramDTO) {
    return this.programUseCases.getInstance().update(id, programDto);
  }

  @Delete('delete/:id')
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(AccountRole.COACH)
  delete(@Param('id') id: number) {
    return this.programUseCases.getInstance().delete(id);
  }
}
