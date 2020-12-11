import ICreateUserDTO from '../dtos/ICreateUserDTO';
import User from '../infra/typeorm/entities/User';

export default interface IUserRepository {
  findAll(): Promise<User[]>;
  findById(id: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  create(id: ICreateUserDTO): Promise<User>;
  save(user: User): Promise<User>;
  listAttendantes(except_user_id: string): Promise<User[]>;
}
