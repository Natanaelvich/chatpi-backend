import { container } from 'tsyringe';
import HandlebarsMailTemplateProvider from './implementations/HandlebarsMailTemplateProvider';
import ITemplateMailProvider from './models/ITemplateMailProvider';

container.registerSingleton<ITemplateMailProvider>(
  'TemplateMailProvider',
  HandlebarsMailTemplateProvider,
);
