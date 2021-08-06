import { ICreateUserTokenDTO } from '@modules/users/dtos/ICreateUserTokenDTO';
import UserToken from '@modules/users/infra/typeorm/entities/UserToken';
import IUserTokenRepository from '../IUserTokenRepository';

class FakeUserTokenRepository implements IUserTokenRepository {
  private usersTokens: UserToken[] = [];

  async findByUserIdAndRefreshToken(
    user_id: string,
    refresh_token: string,
  ): Promise<UserToken | undefined> {
    const userToken = this.usersTokens.find(
      ut => ut.user_id === user_id && ut.refresh_token && refresh_token,
    );
    return userToken;
  }

  async deleteById(id: string): Promise<void> {
    const userToken = this.usersTokens.find(ut => ut.id === id);

    if (userToken) {
      this.usersTokens.splice(this.usersTokens.indexOf(userToken));
    }
  }

  async findByRefreshToken(
    refresh_token: string,
  ): Promise<UserToken | undefined> {
    const userToken = this.usersTokens.find(
      ut => ut.refresh_token === refresh_token,
    );
    return userToken;
  }

  async generate({
    expires_date,
    refresh_token,
    user_id,
  }: ICreateUserTokenDTO): Promise<UserToken> {
    const userToken = new UserToken();

    Object.assign(userToken, {
      expires_date,
      refresh_token,
      user_id,
    });

    this.usersTokens.push(userToken);

    return userToken;
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = this.usersTokens.find(t => t.refresh_token === token);

    return userToken;
  }
}

export default FakeUserTokenRepository;
