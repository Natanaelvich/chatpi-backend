import '@modules/users/providers/index';
import './providers';
import UserRepository from '@modules/users/infra/typeorm/repositories/UserRepository';
import IUserRepository from '@modules/users/repositories/IUserRepository';
import { container } from 'tsyringe';
import IUserTokenRepository from '@modules/users/repositories/IUserTokenRepository';
import UserTokenRepository from '@modules/users/infra/typeorm/repositories/UserTokenRepository';
import IOrphanageRepository from '@modules/orphanage/repositories/IOrphanageRepository';
import OrphanageRepository from '@modules/orphanage/infra/typeorm/repositories/OrphanageRepository';
import ILocationRepository from '@modules/locations/repositories/ILocationRepository';
import LocationRepository from '@modules/locations/infra/typeorm/repositories/LocationRepository';

container.registerSingleton<IOrphanageRepository>(
  'OrphanageRepository',
  OrphanageRepository,
);
container.registerSingleton<IUserRepository>('UserRepository', UserRepository);
container.registerSingleton<IUserTokenRepository>(
  'UserTokenRepository',
  UserTokenRepository,
);
container.registerSingleton<ILocationRepository>(
  'LocationRepository',
  LocationRepository,
);
