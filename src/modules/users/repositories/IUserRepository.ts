import IFindProvidersDTO from '@modules/Appointmensts/dtos/IFindProvidersDTO';
import ICreateUserDTO from '../dtos/ICreateUserDTO';
import User from '../infra/typeorm/entities/User';

export default interface IUserRepository {
  findAllProviders(data: IFindProvidersDTO): Promise<User[]>;
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  create(id: ICreateUserDTO): Promise<User>;
  save(user: User): Promise<User>;
}
