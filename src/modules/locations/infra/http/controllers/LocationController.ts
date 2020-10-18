import { Request, Response } from 'express';
import { container } from 'tsyringe';
import * as Yup from 'yup';
import CreateLocationService from '@modules/locations/services/CreateLocationService';
import ListLocationsService from '@modules/locations/services/ListLocationsService';

export default class LocationController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listLocationsService = container.resolve(ListLocationsService);

    const locations = await listLocationsService.execute();

    return response.status(201).json(locations);
  }

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
