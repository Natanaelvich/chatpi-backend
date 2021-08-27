import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import User from '../infra/typeorm/entities/User';
import IUserRepository from '../repositories/IUserRepository';

interface Request {
  user_id: string;
  clerk: string;
}

@injectable()
class UpdateUserClerkService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
  ) {}

  public async execute({ user_id, clerk }: Request): Promise<User> {
    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw new AppError('user not found', 401);
    }

    user.clerk = clerk;

    await this.userRepository.save(user);

    return user;
  }
}

export default UpdateUserClerkService;
