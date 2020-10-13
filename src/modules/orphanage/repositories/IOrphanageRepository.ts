import ICreateOrphanageDTO from '../dtos/ICreateOrphanageDTO';
import Orphanage from '../infra/typeorm/entities/Orphanage';

export default interface IOrphanageRepository {
  create(id: ICreateOrphanageDTO): Promise<Orphanage>;
  save(user: Orphanage): Promise<Orphanage>;
}
