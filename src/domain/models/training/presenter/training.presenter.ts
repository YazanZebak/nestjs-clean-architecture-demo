import { ApiProperty } from '@nestjs/swagger';
import { Coach } from 'src/domain/entities/coach.entity';
import { Player } from 'src/domain/entities/player.entity';
import { Training } from 'src/domain/entities/training.entity';
import { CoachPresenter } from '../../coach/presenters/coach.presenter';
import { PlayerPresenter } from '../../player/presenters/player.presenter';
import { Status } from 'src/domain/entities/enums/status.enum';

export class TrainingPresenter {
  @ApiProperty()
  trainingID: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  deletedAt: Date;

  @ApiProperty({ enum: Status })
  status: Status;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  playerID: number;

  @ApiProperty()
  coachID: number;

  @ApiProperty({
    type: PlayerPresenter,
    name: 'player',
  })
  player: PlayerPresenter;

  @ApiProperty({
    type: CoachPresenter,
    name: 'coach',
  })
  coach: CoachPresenter;

  constructor(training: Training) {
    this.trainingID = training?.trainingID;
    this.createdAt = training?.createdAt;
    this.deletedAt = training?.deletedAt;
    this.status = training?.status;
    this.startDate = training?.startDate;
    this.playerID = training?.playerID;
    this.coachID = training?.coachID;
    this.player = new PlayerPresenter(training?.player);
    this.coach = new CoachPresenter(training?.coach);
  }
}
