import ShowUserService from '@modules/users/services/ShowUserService';
import UpdateUserService from '@modules/users/services/UpdateUserService';
import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class UsersUpdateController {
  public async show(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const showUserService = container.resolve(ShowUserService);

    const user = await showUserService.execute({ user_id });

    return response.json(user);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const { name, email, password, old_password } = request.body;

    const updateUser = container.resolve(UpdateUserService);

    const user = await updateUser.execute({
      user_id,
      name,
      email,
      password,
      old_password,
    });

    return response.json({ user: classToClass(user) });
  }
}
