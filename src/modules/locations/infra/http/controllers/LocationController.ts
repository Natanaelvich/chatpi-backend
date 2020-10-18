import { Request, Response } from 'express';
import { container } from 'tsyringe';
import * as Yup from 'yup';
import CreateLocationService from '@modules/locations/services/CreateLocationService';

export default class LocationController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { latitude, longitude } = request.body;

    const data = {
      latitude,
      longitude,
    };

    const schema = Yup.object().shape({
      latitude: Yup.string().required(),
      longitude: Yup.string().required(),
    });

    await schema.validate(data, {
      abortEarly: false,
    });

    const createLocationService = container.resolve(CreateLocationService);

    const location = await createLocationService.execute(data);

    const loggedSocket = request.connectedUsers['123456'];

    request.io.to(loggedSocket).emit('location', JSON.stringify(data));

    return response.status(201).json(location);
  }
}
