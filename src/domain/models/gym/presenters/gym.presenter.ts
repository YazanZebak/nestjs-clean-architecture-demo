import { ApiProperty } from '@nestjs/swagger';
import { AccountPresenter } from '../../account/presenters/account.presenter';
import { WeeklyTime } from '../../time/weekly-time.swagger';
import { Gym } from 'src/domain/entities/gym.entity';
import { Account } from 'src/domain/entities/account.entity';
import { Category } from 'src/domain/entities/category.entity';
import { CategoryPresenter } from '../../category/presenters/category.presenter';
import { Coach } from 'src/domain/entities/coach.entity';

export class GymPresenter {
  @ApiProperty()
  gymID: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  logo: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  deletedAt: Date;

  @ApiProperty({
    type: CategoryPresenter,
    name: 'categories',
    isArray: true,
  })
  categories: Category[];

  @ApiProperty({
    type: WeeklyTime,
    name: 'openingTimes',
    isArray: true,
  })
  openingTimes: WeeklyTime[];

  @ApiProperty()
  coaches: Coach[];

  @ApiProperty({
    type: String,
    name: 'gallery',
    isArray: true,
  })
  gallery?: string[];

  @ApiProperty({
    type: AccountPresenter,
    name: 'account',
  })
  account: Account;

  @ApiProperty()
  price: number;

  constructor(gym: Gym) {
    this.gymID = gym?.gymID;
    this.name = gym?.name;
    this.logo = gym?.logo;
    this.address = gym?.address;
    this.phoneNumber = gym?.phoneNumber;
    this.latitude = +gym?.latitude;
    this.longitude = +gym?.longitude;
    this.openingTimes = gym?.openingTimes;
    this.categories = gym?.categories;
    this.gallery = gym?.gallery;
    this.createdAt = gym?.createdAt;
    this.account = gym?.account;
    this.coaches = gym?.coaches;
    this.price = gym?.price;
  }
}
