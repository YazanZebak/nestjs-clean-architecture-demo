import { ApiProperty } from '@nestjs/swagger';

export abstract class AbstractListPresenter<T> {
  @ApiProperty()
  count: number;

  @ApiProperty({
    name: 'data',
    isArray: true,
  })
  data: T[];
}
