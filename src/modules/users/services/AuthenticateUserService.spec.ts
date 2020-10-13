import FakeUserRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import AppError from '@shared/errors/AppError';
import FakeBCryptHashProvider from '../providers/HashProvider/fakes/FakeBCryptHashProvider copy';
import AuthenticateUserService from './AuthenticateUserService';

let fakeUserRepository: FakeUserRepository;
let fakeBCryptHashProvider: FakeBCryptHashProvider;
let authenticateUser: AuthenticateUserService;

describe('Autheticate user', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeBCryptHashProvider = new FakeBCryptHashProvider();

    authenticateUser = new AuthenticateUserService(
      fakeUserRepository,
      fakeBCryptHashProvider,
    );
  });

  it('should be able to create a new authentication', async () => {
    const user = await fakeUserRepository.create({
      name: 'natanael',
      password: '123456',
      email: 'natanael@gmail.com',
    });

    const response = await authenticateUser.execute({
      password: '123456',
      email: 'natanael@gmail.com',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate with non existing user', async () => {
    await expect(
      authenticateUser.execute({
        password: '123456',
        email: 'natanael@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with incorrect password', async () => {
    await fakeUserRepository.create({
      name: 'natanael',
      password: '123456',
      email: 'natanael@gmail.com',
    });

    await expect(
      authenticateUser.execute({
        password: '123458',
        email: 'natanael@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
