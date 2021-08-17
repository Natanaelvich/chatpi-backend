import { ICreateUserTokenDTO } from '@modules/users/dtos/ICreateUserTokenDTO';
import IUserTokenRepository from '@modules/users/repositories/IUserTokenRepository';
import { getRepository, Repository } from 'typeorm';
import UserToken from '../entities/UserToken';

class UserTokenRepository implements IUserTokenRepository {
  private repository: Repository<UserToken>;

  constructor() {
    this.repository = getRepository(UserToken);
  }

  async generate({
    expires_date,
    refresh_token,
    user_id,
  }: ICreateUserTokenDTO): Promise<UserToken> {
    const userToken = this.repository.create({
      expires_date,
      refresh_token,
      user_id,
    });

    await this.repository.save(userToken);

    return userToken;
  }

  async findByUserIdAndRefreshToken(
    user_id: string,
    refresh_token: string,
  ): Promise<UserToken | undefined> {
    const usersTokens = await this.repository.findOne({
      user_id,
      refresh_token,
    });
    return usersTokens;
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findByRefreshToken(
    refresh_token: string,
  ): Promise<UserToken | undefined> {
    const userToken = await this.repository.findOne({ refresh_token });

    return userToken;
  }
}

export default UserTokenRepository;
