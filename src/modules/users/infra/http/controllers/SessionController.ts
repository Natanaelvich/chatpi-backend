import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';
import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class SessionController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const authenticateUser = container.resolve(AuthenticateUserService);

    const { user, token, refresh_token } = await authenticateUser.execute({
      email,
      password,
    });

    return response.json({ user: classToClass(user), token, refresh_token });
  }
}
