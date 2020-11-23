import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import User from '../infra/typeorm/entities/User';
import IUserRepository from '../repositories/IUserRepository';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

interface Request {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string;
}

@injectable()
class UpdateUserService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    password,
    old_password,
  }: Request): Promise<User> {
    const userExists = await this.userRepository.findById(user_id);

    if (!userExists) {
      throw new AppError('User not found');
    }

    const userWithUpdatedEmail = await this.userRepository.findByEmail(email);

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user_id) {
      throw new AppError('Email already registred');
    }

    if (password && !old_password) {
      throw new AppError(
        'You neet to infom the old password to set a new password.',
      );
    }

    if (password && old_password) {
      const checkOldPassword = await this.hashProvider.compareHash(
        old_password,
        userExists.password,
      );
      if (!checkOldPassword) {
        throw new AppError('Old password does not match.');
      }
    }

    if (password) {
      userExists.password = await this.hashProvider.generateHash(password);
    }

    userExists.name = name;
    userExists.email = email;

    return this.userRepository.save(userExists);
  }
}

export default UpdateUserService;
