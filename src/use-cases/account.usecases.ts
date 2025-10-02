import { IBcryptService } from 'src/domain/adapters/bcrypt.interface';
import { IException } from 'src/domain/adapters/exceptions.interface';
import { IJwtService } from 'src/domain/adapters/jwt.interface';
import { AccountRole } from 'src/domain/entities/enums/account-role.enum';
import { Status } from 'src/domain/entities/enums/status.enum';
import { AbstractListPresenter } from 'src/domain/models/abstracts/abstract-list.presenter';
import { CreateAccountDTO } from 'src/domain/models/account/dtos/create-account.dto';
import { LoginDTO } from 'src/domain/models/account/dtos/login.dto';
import { UpdateAccountDTO } from 'src/domain/models/account/dtos/update-account.dto';
import { AccountPresenter } from 'src/domain/models/account/presenters/account.presenter';
import { AuthPresenter } from 'src/domain/models/account/presenters/auth.presenter';
import { CoachPresenter } from 'src/domain/models/coach/presenters/coach.presenter';
import { GymPresenter } from 'src/domain/models/gym/presenters/gym.presenter';
import { PlayerPresenter } from 'src/domain/models/player/presenters/player.presenter';
import { IAccountRepository } from 'src/domain/repositories/account-repository.interface';
import { ICoachRepository } from 'src/domain/repositories/coach-repository.interface';
import { IGymRepository } from 'src/domain/repositories/gym-repositroy.interface';
import { IPlayerRepository } from 'src/domain/repositories/player-repository.interface';

export class AccountUseCases {
  constructor(
    private readonly accountRepository: IAccountRepository,
    private readonly playerRepository: IPlayerRepository,
    private readonly coachRepository: ICoachRepository,
    private readonly gymRepository: IGymRepository,
    private readonly jwtTokenService: IJwtService,
    private readonly bcryptService: IBcryptService,
    private readonly exceptionService: IException,
  ) {}

  async findAll(
    page: number,
    limit: number,
    filter?: Record<string, any>,
    search?: string,
  ): Promise<AbstractListPresenter<AccountPresenter>> {
    const response = await this.accountRepository.findAll(
      page,
      limit,
      filter,
      search,
    );

    const accounts = response.accounts.map(
      (account) => new AccountPresenter(account),
    );

    return { data: accounts, count: response.count };
  }

  async count(): Promise<{ count: number }> {
    const count = await this.accountRepository.getTotalCount();
    return { count };
  }

  async findOneById(id: number): Promise<AccountPresenter> {
    const account = await this.accountRepository.findOneById(id);
    return new AccountPresenter(account);
  }

  async create(accountData: CreateAccountDTO): Promise<AccountPresenter> {
    const newAccount = await this.accountRepository.create({
      ...accountData,
      active: Status.PENDING,
      coins: 100,
    });

    const payload = {
      accountID: newAccount.accountID,
      role: newAccount.role,
    };

    this.jwtTokenService.createToken(payload);
    return new AccountPresenter(newAccount);
  }

  async update(
    id: number,
    accountData: UpdateAccountDTO,
  ): Promise<AccountPresenter> {
    const account = await this.accountRepository.update(id, accountData);
    return new AccountPresenter(account);
  }

  async delete(id: number): Promise<void> {
    await this.accountRepository.remove(id);
  }

  async activate(id: number): Promise<AccountPresenter> {
    const updatedAccount = await this.update(id, {
      active: Status.ACTIVE,
    });
    return updatedAccount;
  }

  async deactivate(id: number): Promise<AccountPresenter> {
    const updatedAccount = await this.update(id, {
      active: Status.DEACTIVE,
    });
    return updatedAccount;
  }

  async login(loginData: LoginDTO): Promise<AuthPresenter> {
    const account = await this.accountRepository.findOneBy(
      'email',
      loginData.email,
    );

    if (!account) {
      this.exceptionService.UnauthorizedException({
        message: 'Invalid Email Credentials',
        errorCode: 401,
      });
    }

    const isPasswordValid = await this.bcryptService.compare(
      loginData.password,
      account.password,
    );

    if (!isPasswordValid) {
      this.exceptionService.UnauthorizedException({
        message: 'Invalid Password Credentials',
        errorCode: 401,
      });
    }

    if (account.role !== loginData.role) {
      this.exceptionService.badRequestException({
        message: `Role Mismatch. The account is assigned the role '${account.role}', 
        but the provided login data specifies the role '${loginData.role}'.`,
        errorCode: 400,
      });
    }

    const payload = {
      accountID: account.accountID,
      role: account.role,
    };

    const token = this.jwtTokenService.createToken(payload);

    switch (account.role) {
      case AccountRole.PLAYER:
        const player = await this.playerRepository.findOneBy('account', {
          accountID: account.accountID,
        });
        return { token: token, player: new PlayerPresenter(player) };

      case AccountRole.COACH:
        const coach = await this.coachRepository.findOneBy('account', {
          accountID: account.accountID,
        });
        return { token: token, coach: new CoachPresenter(coach) };

      case AccountRole.GYM_ADMIN:
        const gym = await this.gymRepository.findOneBy('account', {
          accountID: account.accountID,
        });
        return { token: token, gym: new GymPresenter(gym) };

      default:
        return { token: token, account: new AccountPresenter(account) };
    }
  }

  async signup(signupData: CreateAccountDTO): Promise<AuthPresenter> {
    if (
      signupData.role === AccountRole.GYM_ADMIN ||
      signupData.role === AccountRole.SUPER_ADMIN
    ) {
      this.exceptionService.badRequestException({
        message: 'Signing up a profile with the Admin role is not allowed.',
        errorCode: 400,
      });
    }

    const newAccount = await this.accountRepository.create({
      ...signupData,
      active: Status.PENDING,
      coins: 100,
    });

    const payload = {
      accountID: newAccount.accountID,
      role: newAccount.role,
    };

    const token = this.jwtTokenService.createToken(payload);

    return { token: token, account: new AccountPresenter(newAccount) };
  }

  async statistics(
    start: Date,
    end: Date,
  ): Promise<{ date: Date; count: number }[]> {
    return this.accountRepository.statistics(start, end);
  }
}
