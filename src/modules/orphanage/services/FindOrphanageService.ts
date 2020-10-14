import { inject, injectable } from 'tsyringe';
import IOrphanageRepository from '../repositories/IOrphanageRepository';
import Orphanage from '../infra/typeorm/entities/Orphanage';

interface Request {
  name: string;
  email: string;
  password: string;
}

@injectable()
class FindOrphanageService {
  constructor(
    @inject('OrphanageRepository')
    private orphanageRepository: IOrphanageRepository,
  ) {}

  public async execute(orphanageId: string): Promise<Orphanage | undefined> {
    const orphanage = await this.orphanageRepository.findById(orphanageId);

    return orphanage;
  }
}

export default FindOrphanageService;
