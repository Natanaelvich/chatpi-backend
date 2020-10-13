import ICreateOrphanageDTO from '@modules/orphanage/dtos/ICreateOrphanageDTO';
import IOrphanageRepository from '@modules/orphanage/repositories/IOrphanageRepository';

import { getRepository, Repository } from 'typeorm';
import Orphanage from '../entities/Orphanage';

class OrphanageRepository implements IOrphanageRepository {
  private ormRepository: Repository<Orphanage>;

  constructor() {
    this.ormRepository = getRepository(Orphanage);
  }

  public async create({
    about,
    instructions,
    latitude,
    longitude,
    open_hours,
    open_on_weekends,
  }: ICreateOrphanageDTO): Promise<Orphanage> {
    const response = await this.ormRepository.create({
      about,
      instructions,
      latitude,
      longitude,
      open_hours,
      open_on_weekends,
    });

    const user = await this.save(response);

    return user;
  }

  public async save(orphanage: Orphanage): Promise<Orphanage> {
    const orphanageSave = await this.ormRepository.save(orphanage);

    return orphanageSave;
  }
}

export default OrphanageRepository;
