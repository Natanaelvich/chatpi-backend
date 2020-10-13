import { inject, injectable } from 'tsyringe';
import IOrphanageRepository from '../repositories/IOrphanageRepository';
import Orphanage from '../infra/typeorm/entities/Orphanage';
import ICreateOrphanageDTO from '../dtos/ICreateOrphanageDTO';

interface Request {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateOrphanageService {
  constructor(
    @inject('OrphanageRepository')
    private orphanageRepository: IOrphanageRepository,
  ) {}

  public async execute({
    about,
    instructions,
    latitude,
    longitude,
    open_hours,
    open_on_weekends,
  }: ICreateOrphanageDTO): Promise<Orphanage> {
    const orphanage = this.orphanageRepository.create({
      about,
      instructions,
      latitude,
      longitude,
      open_hours,
      open_on_weekends,
    });

    return orphanage;
  }
}

export default CreateOrphanageService;
