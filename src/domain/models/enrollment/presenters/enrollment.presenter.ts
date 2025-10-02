import { ApiProperty } from '@nestjs/swagger';
import { Coach } from 'src/domain/entities/coach.entity';
import { Status } from 'src/domain/entities/enums/status.enum';
import { Gym } from 'src/domain/entities/gym.entity';
import { CoachPresenter } from '../../coach/presenters/coach.presenter';
import { GymPresenter } from '../../gym/presenters/gym.presenter';
import { WeeklyTime } from '../../time/weekly-time.swagger';
import { Enrollment } from 'src/domain/entities/enrollment.entity';

export class EnrollmentPresenter {
  @ApiProperty()
  enrollmentID: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  deletedAt: Date;

  @ApiProperty()
  salary: number;

  @ApiProperty({ enum: Status })
  status: Status;

  @ApiProperty({
    type: WeeklyTime,
    name: 'shiftTimes',
    isArray: true,
  })
  shiftTimes: WeeklyTime[];

  @ApiProperty()
  coachID: number;

  @ApiProperty()
  gymID: number;

  @ApiProperty({
    type: CoachPresenter,
    name: 'coach',
  })
  coach: Coach;

  @ApiProperty({
    type: GymPresenter,
    name: 'gym',
  })
  gym: Gym;

  constructor(enrollment: Enrollment) {
    this.enrollmentID = enrollment?.enrollmentID;
    this.createdAt = enrollment?.createdAt;
    this.deletedAt = enrollment?.deletedAt;
    this.salary = +enrollment?.salary;
    this.status = enrollment?.status;
    this.shiftTimes = enrollment?.shiftTimes;
    this.coachID = enrollment?.coachID;
    this.gymID = enrollment?.gymID;
    this.coach = enrollment?.coach;
    this.gym = enrollment?.gym;
  }
}
