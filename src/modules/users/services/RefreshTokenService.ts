import { inject, injectable } from 'tsyringe';
import { sign, verify } from 'jsonwebtoken';
import { IUsersTokensRepository } from '@modules/accounts/repositories/IUsersTokensRepository';
import auth from '@config/auth';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import AppError from '@shared/errors/AppError';

interface IPayload {
  sub: string;
  email: string;
}

interface IResponse {
  token: string;
  refresh_token: string;
}

@injectable()
class RefreshTokenService {
  constructor(
    @inject('UsersTokensRepository')
    private usersTokensRepository: IUsersTokensRepository,

    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider,
  ) {}

  async execute(token: string): Promise<IResponse> {
    const { email, sub: user_id } = verify(
      token,
      auth.jwt.secret_refresh_token,
    ) as IPayload;

    const userToken = await this.usersTokensRepository.findByUserIdAndRefreshToken(
      user_id,
      token,
    );
    if (!userToken) {
      throw new AppError('Refresh token does not exists!');
    }

    await this.usersTokensRepository.deleteById(userToken.id);

    const refresh_token = sign({ email }, auth.jwt.secret_refresh_token, {
      subject: user_id,
      expiresIn: auth.jwt.expires_refresh_token_days,
    });

    const expires_date = this.dateProvider.addDays(
      auth.jwt.expires_refresh_token_days,
      null,
    );

    await this.usersTokensRepository.create({
      refresh_token,
      user_id,
      expires_date,
    });

    const newToken = sign({}, auth.jwt.secret, {
      subject: user_id,
      expiresIn: auth.jwt.exp,
    });

    return {
      token: newToken,
      refresh_token,
    };
  }
}

export { RefreshTokenService };
