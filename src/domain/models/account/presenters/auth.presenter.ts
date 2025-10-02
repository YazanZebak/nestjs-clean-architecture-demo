import { ApiProperty, ApiPropertyOptional, ApiTags } from '@nestjs/swagger';
import { AccountPresenter } from './account.presenter';
import { PlayerPresenter } from '../../player/presenters/player.presenter';
import { CoachPresenter } from '../../coach/presenters/coach.presenter';
import { GymPresenter } from '../../gym/presenters/gym.presenter';

@ApiTags('Auth')
export class AuthPresenter {
  @ApiProperty()
  token: string;

  @ApiPropertyOptional({ type: AccountPresenter, name: 'account' })
  account?: AccountPresenter;

  @ApiPropertyOptional({ type: GymPresenter, name: 'gym' })
  gym?: GymPresenter;

  @ApiPropertyOptional({ type: PlayerPresenter, name: 'player' })
  player?: PlayerPresenter;

  @ApiPropertyOptional({ type: CoachPresenter, name: 'coach' })
  coach?: CoachPresenter;
}
