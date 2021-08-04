import UserToken from '../infra/typeorm/entities/UserToken';

export default interface IUserTokenRepository {
  generate(user_id: string): Promise<UserToken>;
  findByToken(token: string): Promise<UserToken | undefined>;
  findByUserIdAndRefreshToken(
    user_id: string,
    refresh_token: string,
  ): Promise<UserToken | undefined>;
  deleteById(id: string): Promise<void>;
  findByRefreshToken(token: string): Promise<UserToken | undefined>;
}
