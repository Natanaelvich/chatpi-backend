import { inject, injectable } from 'tsyringe';
import Location from '../infra/typeorm/entities/Location';
import ILocationRepository from '../repositories/ILocationRepository';

interface Request {
  name: string;
  email: string;
  password: string;
}

@injectable()
class ListLocationsService {
  constructor(
    @inject('LocationRepository')
    private locationRepository: ILocationRepository,
  ) {}

  public async execute(): Promise<Location[]> {
    const locations = this.locationRepository.findAll();

    return locations;
  }
}

export default ListLocationsService;
