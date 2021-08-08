import DayjsDateProvider from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import AppError from '@shared/errors/AppError';
import FakeBCryptHashProvider from '../providers/HashProvider/fakes/FakeBCryptHashProvider copy';
import FakeUserRepository from '../repositories/fakes/FakeUserRepository';
import FakeUserTokenRepository from '../repositories/fakes/FakeUserTokenRepository';
import AuthenticateUserService from './AuthenticateUserService';

let fakeUserRepository: FakeUserRepository;
let fakeUserTokenRepository: FakeUserTokenRepository;
let fakeBCryptHashProvider: FakeBCryptHashProvider;
let dateProvider: DayjsDateProvider;
let authenticateUser: AuthenticateUserService;

describe('Autheticate user', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeUserTokenRepository = new FakeUserTokenRepository();
    fakeBCryptHashProvider = new FakeBCryptHashProvider();
    dateProvider = new DayjsDateProvider();

    authenticateUser = new AuthenticateUserService(
      fakeUserRepository,
      fakeUserTokenRepository,
      fakeBCryptHashProvider,
      dateProvider,
    );
  });

  it('should be able to create a new authentication', async () => {
    const user = await fakeUserRepository.create({
      name: 'natanael',
      password: '123456',
      email: 'natanael@gmail.com',
      clerk: '',
    });

    const response = await authenticateUser.execute({
      password: '123456',
      email: 'natanael@gmail.com',
    });

    expect(response).toHaveProperty('token');
    expect(response).toHaveProperty('refresh_token');
    expect(response).toHaveProperty('user');
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
      clerk: '',
    });

    await expect(
      authenticateUser.execute({
        password: '123458',
        email: 'natanael@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
