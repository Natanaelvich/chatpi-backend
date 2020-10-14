import { inject, injectable } from 'tsyringe';
import IOrphanageRepository from '../repositories/IOrphanageRepository';
import Orphanage from '../infra/typeorm/entities/Orphanage';

interface Request {
  name: string;
  email: string;
  password: string;
}

@injectable()
class ListOrphanageService {
  constructor(
    @inject('OrphanageRepository')
    private orphanageRepository: IOrphanageRepository,
  ) {}

  public async execute(): Promise<Orphanage[]> {
    const orphanages = await this.orphanageRepository.findAll();

    return orphanages;
  }
}

export default ListOrphanageService;
