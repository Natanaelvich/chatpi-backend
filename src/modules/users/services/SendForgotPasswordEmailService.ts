import { inject, injectable } from 'tsyringe';
import path from 'path';

import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';
import AppError from '@shared/errors/AppError';
import auth from '@config/auth';
import { sign } from 'jsonwebtoken';
import { IDateProvider } from '@shared/container/providers/DateProvider/IDateProvider';
import IUserRepository from '../repositories/IUserRepository';
import IUserTokenRepository from '../repositories/IUserTokenRepository';

interface Request {
  email: string;
}

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('UserTokenRepository')
    private userTokenRepository: IUserTokenRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,

    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider,
  ) {}

  public async execute({ email }: Request): Promise<void> {
    const userExistis = await this.userRepository.findByEmail(email);

    if (!userExistis) {
      throw new AppError('User does not exists');
    }

    // REFACT TOKEN TO PROVIDER TOKEN
    const {
      jwt: { exp, secret },
    } = auth;

    const token = sign({}, secret, {
      subject: userExistis.id,
      expiresIn: exp,
    });

    const expires_date = this.dateProvider.addHours(3);

    await this.userTokenRepository.generate({
      refresh_token: token,
      user_id: userExistis.id,
      expires_date,
    });

    const forgotPasswordTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'forgot_password.hbs',
    );

    await this.mailProvider.sendMail({
      to: {
        name: userExistis.name,
        email: userExistis.email,
      },
      subject: '[ChatPI] Recuperação de senha',
      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          name: userExistis.name,
          link: `${process.env.APP_WEB_URL}/reset_password?token=${token}`,
        },
      },
    });
  }
}

export default SendForgotPasswordEmailService;
