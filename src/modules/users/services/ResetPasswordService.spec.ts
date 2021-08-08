import auth from '@config/auth';
import FakeUserRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import DayjsDateProvider from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import AppError from '@shared/errors/AppError';
import { sign } from 'jsonwebtoken';
import FakeBCryptHashProvider from '../providers/HashProvider/fakes/FakeBCryptHashProvider copy';
import FakeUserTokenRepository from '../repositories/fakes/FakeUserTokenRepository';
import ResetPasswordService from './ResetPasswordService';

let fakeUserRepository: FakeUserRepository;
let resetPassword: ResetPasswordService;
let fakeUserTokenRepository: FakeUserTokenRepository;
let fakeBCryptHashProvider: FakeBCryptHashProvider;

const dateProvider = new DayjsDateProvider();

describe('ResetPasswordService', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeUserTokenRepository = new FakeUserTokenRepository();
    fakeBCryptHashProvider = new FakeBCryptHashProvider();

    resetPassword = new ResetPasswordService(
      fakeUserRepository,
      fakeUserTokenRepository,
      fakeBCryptHashProvider,
    );
  });

  it('should be able to reset the password', async () => {
    const user = await fakeUserRepository.create({
      name: 'natanael',
      email: 'natanael@gmail.com',
      password: '123456',
      clerk: '',
    });

    const generateHash = jest.spyOn(fakeBCryptHashProvider, 'generateHash');

    // REFACT TOKEN TO PROVIDER TOKEN
    const {
      jwt: { exp, secret },
    } = auth;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn: exp,
    });

    const expires_date = dateProvider.addHours(3);

    await fakeUserTokenRepository.generate({
      refresh_token: token,
      user_id: user.id,
      expires_date,
    });

    await resetPassword.execute({
      password: '123123',
      token,
    });

    const updatedUser = await fakeUserRepository.findById(user.id);

    expect(generateHash).toHaveBeenCalledWith('123123');
    expect(updatedUser?.password).toBe('123123');
  });

  it('should not be able to reset the password with non-exisiting token', async () => {
    await expect(
      resetPassword.execute({
        token: 'no-token',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password with non-exisiting user', async () => {
    // REFACT TOKEN TO PROVIDER TOKEN
    const {
      jwt: { exp, secret },
    } = auth;

    const token = sign({}, secret, {
      subject: 'non-exisiting user',
      expiresIn: exp,
    });

    await expect(
      resetPassword.execute({
        token,
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password if passed more than 2 hours', async () => {
    const user = await fakeUserRepository.create({
      name: 'natanael',
      email: 'natanael@gmail.com',
      password: '123456',
      clerk: '',
    });

    // REFACT TOKEN TO PROVIDER TOKEN
    const {
      jwt: { exp, secret },
    } = auth;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn: exp,
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();

      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPassword.execute({
        password: '234234',
        token,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
