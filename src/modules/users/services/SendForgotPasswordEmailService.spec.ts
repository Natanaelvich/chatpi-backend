import FakeUserRepository from '@modules/users/repositories/fakes/FakeUserRepository';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import AppError from '@shared/errors/AppError';
import FakeUserTokenRepository from '../repositories/fakes/FakeUserTokenRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakeUserRepository: FakeUserRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokenRepository: FakeUserTokenRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('Send ForgotPassword Email', () => {
  beforeEach(() => {
    fakeUserRepository = new FakeUserRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokenRepository = new FakeUserTokenRepository();

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUserRepository,
      fakeMailProvider,
      fakeUserTokenRepository,
    );
  });

  it('should be able to recover the password using the email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUserRepository.create({
      name: 'natanael',
      email: 'natanael@gmail.com',
      password: '123456',
      clerk: '',
    });

    await sendForgotPasswordEmail.execute({
      email: 'natanael@gmail.com',
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to recover a non-existing user password', async () => {
    await expect(
      sendForgotPasswordEmail.execute({
        email: 'natanael@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should generate a forgot password token', async () => {
    const generate = jest.spyOn(fakeUserTokenRepository, 'generate');
    const user = await fakeUserRepository.create({
      name: 'natanael',
      email: 'natanael@gmail.com',
      password: '123456',
      clerk: '',
    });

    await sendForgotPasswordEmail.execute({
      email: 'natanael@gmail.com',
    });

    expect(generate).toHaveBeenCalledWith(user.id);
  });
});
