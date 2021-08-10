import { inject, injectable } from 'tsyringe';
import { sign, verify } from 'jsonwebtoken';
import auth from '@config/auth';
import AppError from '@shared/errors/AppError';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import IUserTokenRepository from '../repositories/IUserTokenRepository';

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
    @inject('UserTokenRepository')
    private userTokenRepository: IUserTokenRepository,

    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider,
  ) {}

  async execute(token: string): Promise<IResponse> {
    let email = '';
    let user_id = '';

    try {
      const { email: emailVerfify, sub: user_id_verify } = verify(
        token,
        auth.jwt.secret_refresh_token,
      ) as IPayload;

      email = emailVerfify;
      user_id = user_id_verify;
    } catch (error) {
      throw new AppError(error.message, 401);
    }

    const userToken = await this.userTokenRepository.findByUserIdAndRefreshToken(
      user_id,
      token,
    );
    if (!userToken) {
      throw new AppError('Refresh token does not exists!');
    }

    await this.userTokenRepository.deleteById(userToken.id);

    const refresh_token = sign({ email }, auth.jwt.secret_refresh_token, {
      subject: user_id,
      expiresIn: auth.jwt.expires_refresh_token_days,
    });

    const expires_date = this.dateProvider.addDays(
      auth.jwt.expires_refresh_token_days,
    );

    await this.userTokenRepository.generate({
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
