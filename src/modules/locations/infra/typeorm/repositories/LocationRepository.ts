import ICreateLocationsDTO from '@modules/locations/dtos/ICreateLocationsDTO';
import ILocationRepository from '@modules/locations/repositories/ILocationRepository';

import { getRepository, Repository } from 'typeorm';
import Location from '../entities/Location';

class LocationRepository implements ILocationRepository {
  private ormRepository: Repository<Location>;

  constructor() {
    this.ormRepository = getRepository(Location);
  }

  public async findAll(): Promise<Location[]> {
    const locations = this.ormRepository.find();

    return locations;
  }

  public async create({
    latitude,
    longitude,
  }: ICreateLocationsDTO): Promise<Location> {
    const response = this.ormRepository.create({
      latitude,
      longitude,
    });

    const location = await this.save(response);

    return location;
  }

  public async save(location: Location): Promise<Location> {
    const locationSave = await this.ormRepository.save(location);

    return locationSave;
  }
}

export default LocationRepository;
