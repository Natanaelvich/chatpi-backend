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

const port = process.env.PORT || 3334;

interface ValidationErrors {
  [key: string]: string[];
}

const app = express();
const http = new Server(app);
const io = socket(http);

const connectedUsers = {} as any;
const typers = {} as any;

io.on('connection', socketIo => {
  const { user } = socketIo.handshake.query;

  connectedUsers[user] = socketIo.id;

  socketIo.on('message', message => {
    const dataMessage = JSON.parse(message);
    delete typers[dataMessage.user];
    io.emit('typing', typers);
    io.to(connectedUsers[dataMessage.toUser]).emit('message', message);
  });

  socketIo.on('typing', typer => {
    typers[typer.user] = 1;
    io.emit('typing', typers);
  });

  socketIo.on('typingBlur', typer => {
    delete typers[typer.user];
    io.emit('typing', typers);
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
