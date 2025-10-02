import { ApiProperty } from '@nestjs/swagger';
import { Membership } from 'src/domain/entities/membership.entity';
import { PlayerPresenter } from '../../player/presenters/player.presenter';
import { GymPresenter } from '../../gym/presenters/gym.presenter';
import { Player } from 'src/domain/entities/player.entity';
import { Gym } from 'src/domain/entities/gym.entity';
import { Status } from 'src/domain/entities/enums/status.enum';

export class MembershipPresenter {
  @ApiProperty()
  membershipID: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  deletedAt: Date;

  @ApiProperty()
  paid: number;

  @ApiProperty()
  fee: number;

  @ApiProperty({ enum: Status })
  status: Status;

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty()
  playerID: number;

  @ApiProperty()
  gymID: number;

  @ApiProperty({
    type: PlayerPresenter,
    name: 'player',
  })
  player: Player;

  @ApiProperty({
    type: GymPresenter,
    name: 'gym',
  })
  gym: Gym;

  constructor(membership: Membership) {
    this.membershipID = membership?.membershipID;
    this.createdAt = membership?.createdAt;
    this.deletedAt = membership?.deletedAt;
    this.paid = +membership?.paid;
    this.fee = +membership?.fee;
    this.status = membership?.status;
    this.startDate = membership?.startDate;
    this.endDate = membership?.endDate;
    this.playerID = membership?.playerID;
    this.gymID = membership?.gymID;
    this.player = membership?.player;
    this.gym = membership?.gym;
  }
}
