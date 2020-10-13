import CreateOrphanageService from '@modules/orphanage/services/CreateOrphanageService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class OrphanageController {
  public async create(request: Request, response: Response): Promise<Response> {
    const {
      about,
      instructions,
      latitude,
      longitude,
      open_hours,
      open_on_weekends,
    } = request.body;

    const createUser = container.resolve(CreateOrphanageService);

    const orphanage = await createUser.execute({
      about,
      instructions,
      latitude,
      longitude,
      open_hours,
      open_on_weekends,
    });

    return response.status(201).json({ orphanage });
  }
}
