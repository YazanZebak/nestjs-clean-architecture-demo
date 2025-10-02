import { ApiProperty } from '@nestjs/swagger';
import { Coach } from 'src/domain/entities/coach.entity';
import { Gender } from 'src/domain/entities/enums/gender.enum';
import { AccountPresenter } from '../../account/presenters/account.presenter';
import { CategoryPresenter } from '../../category/presenters/category.presenter';
import { Category } from 'src/domain/entities/category.entity';
import { Account } from 'src/domain/entities/account.entity';

export class CoachPresenter {
  @ApiProperty()
  coachID: number;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  age: number;

  @ApiProperty({ enum: Gender })
  gender: Gender;

  @ApiProperty()
  yearsOfExperience: number;

  @ApiProperty()
  certificatePath: string;

  @ApiProperty()
  about: string;

  @ApiProperty()
  price: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  deletedAt: Date;

  @ApiProperty({
    type: CategoryPresenter,
    name: 'category',
  })
  category: Category;

  @ApiProperty()
  accountID: number;

  @ApiProperty({
    type: AccountPresenter,
    name: 'account',
  })
  account: Account;

  @ApiProperty()
  rating: number;

  constructor(coach: Coach | any) {
    this.coachID = coach?.coachID;
    this.firstName = coach?.firstName;
    this.lastName = coach?.lastName;
    this.age = coach?.age;
    this.gender = coach?.gender;
    this.yearsOfExperience = coach?.yearsOfExperience;
    this.certificatePath = coach?.certificatePath;
    this.about = coach?.about;
    this.createdAt = coach?.createdAt;
    this.deletedAt = coach?.deletedAt;
    this.category = coach?.category;
    this.accountID = coach?.account?.accountID;
    this.account = coach?.account;
    this.rating = coach?.rating;
    this.price = coach?.price;
  }
}
