import { Type, applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { AbstractListPresenter } from 'src/domain/models/abstracts/abstract-list.presenter';

export const ApiOkResponseList = <DataDTO extends Type<unknown>>(
  dataDto: DataDTO,
) =>
  applyDecorators(
    ApiExtraModels(AbstractListPresenter, dataDto),
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(AbstractListPresenter) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(dataDto) },
              },
            },
          },
        ],
      },
    }),
  );
