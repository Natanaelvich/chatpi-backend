import ICreateOrphanageDTO from '../dtos/ICreateOrphanageDTO';
import Orphanage from '../infra/typeorm/entities/Orphanage';

export default interface IOrphanageRepository {
  create(data: ICreateOrphanageDTO): Promise<Orphanage>;
  save(user: Orphanage): Promise<Orphanage>;
  findAll(): Promise<Orphanage[]>;
  findById(orphanageId: string): Promise<Orphanage | undefined>;
}
