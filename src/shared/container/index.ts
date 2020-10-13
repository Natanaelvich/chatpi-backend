import '@modules/users/providers/index';
import UserRepository from '@modules/users/infra/typeorm/repositories/UserRepository';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import { container } from 'tsyringe';
import IUserTokenRepository from '@modules/users/repositories/IUserTokenRepository';
import UserTokenRepository from '@modules/users/infra/typeorm/repositories/UserTokenRepository';
import IOrphanageRepository from '@modules/orphanage/repositories/IOrphanageRepository';
import OrphanageRepository from '@modules/orphanage/infra/typeorm/repositories/OrphanageRepository';

container.registerSingleton<IUserRepository>('UserRepository', UserRepository);
container.registerSingleton<IUserTokenRepository>(
  'UserTokenRepository',
  UserTokenRepository,
);
container.registerSingleton<IOrphanageRepository>(
  'OrphanageRepository',
  OrphanageRepository,
);
