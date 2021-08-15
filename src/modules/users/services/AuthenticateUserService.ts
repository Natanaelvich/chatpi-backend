import { sign } from 'jsonwebtoken';

import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import auth from '../../../config/auth';
import User from '../infra/typeorm/entities/User';
import IUserRepository from '../repositories/IUserRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';
import IUserTokenRepository from '../repositories/IUserTokenRepository';

interface Request {
  email: string;
  password: string;
}

@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('UserTokenRepository')
    private userTokenRepository: IUserTokenRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider,
  ) {}

  public async execute({
    email,
    password,
  }: Request): Promise<{ user: User; token: string; refresh_token: string }> {
    const {
      jwt: {
        exp,
        expires_in_refresh_token,
        expires_refresh_token_days,
        secret,
        secret_refresh_token,
      },
    } = auth;

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Incorrect email/password combination', 401);
    }

    const passwordMatched = await this.hashProvider.compareHash(
      password,
      user.password,
    );

    if (!passwordMatched) {
      throw new AppError('Incorrect email/password combination', 401);
    }

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn: exp,
    });

    const refresh_token = sign({ email }, secret_refresh_token, {
      subject: user.id,
      expiresIn: expires_in_refresh_token,
    });

    const refresh_token_expires_date = this.dateProvider.addDays(
      expires_refresh_token_days,
    );

    await this.userTokenRepository.deleteById(user.id);

    await this.userTokenRepository.generate({
      user_id: user.id,
      refresh_token,
      expires_date: refresh_token_expires_date,
    });

    return { user, token, refresh_token };
  }
}

export default AuthenticateUserService;
