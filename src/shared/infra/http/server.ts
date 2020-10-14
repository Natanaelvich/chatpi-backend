import 'reflect-metadata';
import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';
import { ValidationError } from 'yup';

import '@shared/infra/typeorm';
import '@shared/container';

import AppError from '@shared/errors/AppError';
import upload from '@config/upload';
import routes from './routes';

interface ValidationErrors {
  [key: string]: string[];
}

const app = express();
app.use(cors({ credentials: true, origin: true }));

app.use(express.json());
app.use('/files', express.static(upload.tmpFolfer));
app.use(routes);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof ValidationError) {
    const errors: ValidationErrors = {};

    err.inner.forEach(err => {
      errors[err.path] = err.errors;
    });

    return response.status(400).json({
      status: 'validation fails',
      errors,
    });
  }
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  // eslint-disable-next-line no-console
  console.log(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error ',
  });
});

app.listen(3333);
