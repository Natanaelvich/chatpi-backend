import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import User from '../infra/typeorm/entities/User';
import IUserRepository from '../repositories/IUserRepository';

interface Request {
  user_id: string;
}

@injectable()
class ShowUserService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  public async execute({ user_id }: Request): Promise<User> {
    const userExists = await this.userRepository.findById(user_id);

    if (!userExists) {
      throw new AppError('User not founf');
    }
    return userExists;
  }
}

export default ShowUserService;
