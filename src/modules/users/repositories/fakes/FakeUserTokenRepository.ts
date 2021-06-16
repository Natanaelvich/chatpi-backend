import UserToken from '@modules/users/infra/typeorm/entities/UserToken';
import { v4 as uuidv4 } from 'uuid';
import IUserTokenRepository from '../IUserTokenRepository';

class FakeUserTokenRepository implements IUserTokenRepository {
  private tokens: UserToken[] = [];

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = new UserToken();

    Object.assign(userToken, {
      id: uuidv4(),
      token: uuidv4(),
      user_id,
      created_at: new Date(),
      updated_at: new Date(),
    });

    this.tokens.push(userToken);

    return userToken;
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = this.tokens.find(t => t.token === token);

    return userToken;
  }
}

export default FakeUserTokenRepository;
