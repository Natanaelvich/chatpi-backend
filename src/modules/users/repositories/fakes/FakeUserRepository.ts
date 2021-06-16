import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import { v4 as uuidv4 } from 'uuid';
import User from '../../infra/typeorm/entities/User';

class FakeUserRepository implements IUserRepository {
  private users: User[] = [];

  public async findAll(): Promise<User[]> {
    const { users } = this;

    return users;
  }

  public async listAttendantes(except_user_id: string): Promise<User[]> {
    const users = this.users.filter(u => !!u.clerk && u.id !== except_user_id);
    return users;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.email === email);

    return findUser;
  }

  public async findById(id: string): Promise<User | undefined> {
    const findUser = this.users.find(user => user.id === id);

    return findUser;
  }

  public async create({
    email,
    name,
    password,
  }: ICreateUserDTO): Promise<User> {
    const user = new User();

    Object.assign(user, { id: uuidv4(), name, password, email });

    this.users.push(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    const findIndex = this.users.findIndex(findUser => findUser.id === user.id);

    this.users[findIndex] = user;

    return user;
  }
}

export default FakeUserRepository;
