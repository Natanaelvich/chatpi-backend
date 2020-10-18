import ICreateLocationsDTO from '../dtos/ICreateLocationsDTO';
import Location from '../infra/typeorm/entities/Location';

export default interface ILocationRepository {
  create(data: ICreateLocationsDTO): Promise<Location>;
  save(location: Location): Promise<Location>;
  findAll(): Promise<Location[]>;
}
