import 'reflect-metadata';
import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import avatarsMiddleware from 'adorable-avatars';
import cors from 'cors';
import { ValidationError } from 'yup';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';

import '@shared/infra/typeorm';
import '@shared/container';
import { Server } from 'http';
import socket from 'socket.io';

import AppError from '@shared/errors/AppError';
import upload from '@config/upload';
import routes from './routes';

const port = process.env.PORT || 3335;

interface ValidationErrors {
  [key: string]: string[];
}

const app = express();
const http = new Server(app);
const io = socket(http);

const connectedUsers = {} as Record<string, string>;
const typers = {} as Record<string, string>;

io.on('connection', socketIo => {
  const { user } = socketIo.handshake.query;

  connectedUsers[user] = socketIo.id;

  socketIo.on('message', message => {
    const dataMessage = JSON.parse(message);

    delete typers[dataMessage.user];
    io.to(connectedUsers[dataMessage.toUser]).emit(
      'typing',
      JSON.stringify(typers),
    );

    io.to(connectedUsers[dataMessage.toUser]).emit('message', message);
  });

  socketIo.on('typing', typer => {
    const typerParsed = JSON.parse(typer);
    typers[typerParsed.user] = 'typer';

    io.to(connectedUsers[typerParsed.toUser]).emit(
      'typing',
      JSON.stringify(typers),
    );
  });

  socketIo.on('typingBlur', typer => {
    const typerParsed = JSON.parse(typer);
    delete typers[typer.user];
    io.to(connectedUsers[typerParsed.toUser]).emit(
      'typing',
      JSON.stringify(typers),
    );
  });

  socketIo.once('disconnect', () => {
    delete connectedUsers[user];

    io.emit('usersLoggeds', JSON.stringify(connectedUsers));
  });

  io.emit('usersLoggeds', JSON.stringify(connectedUsers));
});

app.use(cors({ credentials: true, origin: true }));
app.use('/myAvatars', avatarsMiddleware);

Sentry.init({
  dsn: process.env.SENTRY_DNS,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app }),
  ],
  tracesSampleRate: 1.0,
});

app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.use(express.json());
app.use('/files', express.static(upload.uploadsFolder));
app.use((request: Request, _: Response, next: NextFunction) => {
  request.io = io;
  request.connectedUsers = connectedUsers;

  return next();
});
app.use(routes);

app.use(Sentry.Handlers.errorHandler());

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof ValidationError) {
    const errors: ValidationErrors = {};

    err.inner.forEach(erro => {
      errors[erro.path] = erro.errors;
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

  console.log(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error ',
  });
});

http.listen(port);
