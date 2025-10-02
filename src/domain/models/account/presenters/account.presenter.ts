import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { Account } from 'src/domain/entities/account.entity';
import { AccountRole } from 'src/domain/entities/enums/account-role.enum';
import { Status } from 'src/domain/entities/enums/status.enum';

@ApiTags('Account')
export class AccountPresenter {
  @ApiProperty()
  accountID: number;

  @ApiProperty()
  email: string;

  @ApiProperty({ enum: AccountRole })
  role: AccountRole;

  @ApiProperty({ enum: Status, default: Status.PENDING })
  active: Status;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  deletedAt: Date;

  @ApiProperty()
  profileImage: string;

  @ApiProperty()
  phoneNumber: string;

  @ApiProperty()
  coins: number;

  constructor(account: Account) {
    this.accountID = account?.accountID;
    this.email = account?.email;
    this.role = account?.role;
    this.active = account?.active;
    this.createdAt = account?.createdAt;
    this.deletedAt = account?.deletedAt;
    this.profileImage = account?.profileImage;
    this.phoneNumber = account?.phoneNumber;
    this.coins = account?.coins;
  }
}
