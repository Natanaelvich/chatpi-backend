import upload from '@config/upload';
import { container } from 'tsyringe';
import DiskStorageProvider from './implementations/DiskStorageProvider';
import S3storageProvider from './implementations/S3storageProvider';
import IStorageProvider from './models/IStorageProvider';

const providers = {
  disk: DiskStorageProvider,
  s3: S3storageProvider,
};

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  providers[upload.driver],
);
