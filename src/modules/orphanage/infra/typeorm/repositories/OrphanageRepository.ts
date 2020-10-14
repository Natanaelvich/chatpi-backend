import ICreateOrphanageDTO from '@modules/orphanage/dtos/ICreateOrphanageDTO';
import IOrphanageRepository from '@modules/orphanage/repositories/IOrphanageRepository';

import { getRepository, Repository } from 'typeorm';
import Orphanage from '../entities/Orphanage';

class OrphanageRepository implements IOrphanageRepository {
  private ormRepository: Repository<Orphanage>;

  constructor() {
    this.ormRepository = getRepository(Orphanage);
  }

  public async findById(orphanageId: string): Promise<Orphanage | undefined> {
    const orphanage = await this.ormRepository.findOne(orphanageId, {
      relations: ['images'],
    });

    return orphanage;
  }

  public async findAll(): Promise<Orphanage[]> {
    const orphanages = await this.ormRepository.find({ relations: ['images'] });

    return orphanages;
  }

  public async create({
    about,
    instructions,
    latitude,
    longitude,
    open_hours,
    open_on_weekends,
    images,
    name,
  }: ICreateOrphanageDTO): Promise<Orphanage> {
    const response = this.ormRepository.create({
      name,
      about,
      instructions,
      latitude,
      longitude,
      open_hours,
      open_on_weekends,
      images,
    });

    const orphanage = await this.save(response);

    return orphanage;
  }

  public async save(orphanage: Orphanage): Promise<Orphanage> {
    const orphanageSave = await this.ormRepository.save(orphanage);

    return orphanageSave;
  }
}

export default OrphanageRepository;
