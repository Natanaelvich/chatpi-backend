import { ICreateUserTokenDTO } from '../dtos/ICreateUserTokenDTO';
import UserToken from '../infra/typeorm/entities/UserToken';

export default interface IUserTokenRepository {
  generate({
    expires_date,
    refresh_token,
    user_id,
  }: ICreateUserTokenDTO): Promise<UserToken>;
  findByUserIdAndRefreshToken(
    user_id: string,
    refresh_token: string,
  ): Promise<UserToken | undefined>;
  deleteById(id: string): Promise<void>;
  findByRefreshToken(token: string): Promise<UserToken | undefined>;
}
