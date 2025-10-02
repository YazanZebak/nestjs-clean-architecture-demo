import { ApiProperty } from '@nestjs/swagger';
import { Gender } from 'src/domain/entities/enums/gender.enum';
import { Player } from 'src/domain/entities/player.entity';
import { AccountPresenter } from '../../account/presenters/account.presenter';
import { Account } from 'src/domain/entities/account.entity';

export class PlayerPresenter {
  @ApiProperty()
  playerID: number;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  age: number;

  @ApiProperty({ enum: Gender })
  gender: Gender;

  @ApiProperty()
  weight: number;

  @ApiProperty()
  height: number;

  @ApiProperty()
  yearsOfPlaying: number;

  @ApiProperty()
  about: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  deletedAt: Date;

  @ApiProperty()
  accountID: number;

  @ApiProperty({
    type: AccountPresenter,
    name: 'account',
  })
  account: Account;

  constructor(player: Player) {
    this.playerID = player?.playerID;
    this.firstName = player?.firstName;
    this.lastName = player?.lastName;
    this.age = player?.age;
    this.gender = player?.gender;
    this.weight = player?.weight;
    this.height = player?.height;
    this.yearsOfPlaying = player?.yearsOfPlaying;
    this.about = player?.about;
    this.createdAt = player?.createdAt;
    this.deletedAt = player?.deletedAt;
    this.accountID = player?.account?.accountID;
    this.account = player?.account;
  }
}
