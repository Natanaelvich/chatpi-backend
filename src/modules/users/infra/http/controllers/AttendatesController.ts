import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import UserRepository from '../../typeorm/repositories/UserRepository';

export default class AttendatesController {
  public async index(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const listAttendantes = container.resolve(UserRepository);

    const attendantes = await listAttendantes.listAttendantes(user_id);

    return response.json(classToClass(attendantes));
  }
}
