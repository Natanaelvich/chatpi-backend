import UpdateUserClerkService from '@modules/users/services/UpdateUserClerkService';
import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class UpdateClerkController {
  public async update(request: Request, response: Response): Promise<Response> {
    const { clerk } = request.body;

    const updateUserClerkService = container.resolve(UpdateUserClerkService);
    const user = await updateUserClerkService.execute({
      user_id: request.user.id,
      clerk,
    });

    return response.json(classToClass(user));
  }
}
