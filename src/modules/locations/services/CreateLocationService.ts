import { inject, injectable } from 'tsyringe';
import ICreateLocationsDTO from '../dtos/ICreateLocationsDTO';
import Location from '../infra/typeorm/entities/Location';
import ILocationRepository from '../repositories/ILocationRepository';

interface Request {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateLocationService {
  constructor(
    @inject('LocationRepository')
    private locationRepository: ILocationRepository,
  ) {}

  public async execute({
    latitude,
    longitude,
  }: ICreateLocationsDTO): Promise<Location> {
    const location = this.locationRepository.create({
      latitude,
      longitude,
    });

    return location;
  }
}

export default CreateLocationService;
