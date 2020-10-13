import FakeUserRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import CreateUserService from '@modules/users/services/CreateUserService';
import AppError from '@shared/errors/AppError';
import FakeBCryptHashProvider from '../providers/HashProvider/fakes/FakeBCryptHashProvider copy';

let fakeUserRepository: FakeUserRepository;
let fakeBCryptHashProvider: FakeBCryptHashProvider;

let createUser: CreateUserService;

describe('Create new user', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeBCryptHashProvider = new FakeBCryptHashProvider();

    createUser = new CreateUserService(
      fakeUserRepository,
      fakeBCryptHashProvider,
    );
  });

  it('should be able to create a new user', async () => {
    const user = await createUser.execute({
      name: 'natanael',
      password: '123456',
      email: 'natanael@gmail.com',
    });

    expect(user).toHaveProperty('id');
    expect(user.name).toBe('natanael');
  });

  it('should not be able to create a new user with same email', async () => {
    const email = 'natanael@gmail.com';

    await createUser.execute({
      name: 'natanael',
      password: '123456',
      email,
    });

    await expect(
      createUser.execute({
        name: 'natanael',
        password: '123456',
        email,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
