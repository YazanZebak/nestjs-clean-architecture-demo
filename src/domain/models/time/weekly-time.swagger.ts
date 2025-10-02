import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class WeeklyTime {
  @ApiProperty()
  @IsString()
  day: string;

  @ApiProperty()
  @IsString()
  startTime: string;

  @ApiProperty()
  @IsString()
  endTime: string;

  constructor(time: WeeklyTime) {
    this.day = time?.day;
    this.startTime = time?.startTime;
    this.endTime = time?.endTime;
  }
}
