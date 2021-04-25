import 'reflect-metadata';
import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';
import avatarsMiddleware from 'adorable-avatars';
import cors from 'cors';
import { ValidationError } from 'yup';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';
import axios from 'axios';

import '@shared/infra/typeorm';
import '@shared/container';
import { Server } from 'http';
import socket from 'socket.io';

import AppError from '@shared/errors/AppError';
import upload from '@config/upload';
import RedisCacheProvider from '@shared/container/providers/CacheProvider/implementations/RedisCacheProvider';
import routes from './routes';

const port = process.env.PORT || 3335;

const cache = new RedisCacheProvider();

interface ValidationErrors {
  [key: string]: string[];
}

const app = express();
const http = new Server(app);
const io = socket(http);

const connectedUsers = {} as Record<string, string>;
const typers = {} as Record<string, string>;

io.on('connection', async socketIo => {
  const { user } = socketIo.handshake.query;

  connectedUsers[user] = socketIo.id;

  socketIo.on('message', async message => {
    const dataMessage = JSON.parse(message);

    delete typers[dataMessage.user];

    io.to(connectedUsers[dataMessage.toUser]).emit(
      'typing',
      JSON.stringify(typers),
    );

    io.to(connectedUsers[dataMessage.toUser]).emit('message', message);

    if (!connectedUsers[dataMessage.toUser]) {
      const messages = await cache.recover<any>(dataMessage.toUser);

      if (messages) {
        await cache.save(dataMessage.toUser, [...messages, { ...dataMessage }]);
      } else {
        await cache.save(dataMessage.toUser, [{ ...dataMessage }]);
      }

      const tokenExpo = await cache.recover<any>(
        `${dataMessage.toUser}:expo_token`,
      );

      if (tokenExpo) {
        try {
          await axios.post('https://exp.host/--/api/v2/push/send', {
            to: tokenExpo,
            sound: 'default',
            title: dataMessage.name,
            body: dataMessage.message,
            data: {
              data: 'hello',
            },
          });
        } catch (error) {
          console.warn(error);
        }
      }
    }
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

    delete typers[typerParsed.user];

    io.to(connectedUsers[typerParsed.toUser]).emit(
      'typing',
      JSON.stringify(typers),
    );
  });

  socketIo.on('expoToken', async token => {
    await cache.save(`${user}:expo_token`, token);
  });

  socketIo.once('disconnect', () => {
    delete connectedUsers[user];
    delete typers[user];

    io.emit('usersLoggeds', JSON.stringify(connectedUsers));
    io.emit('typing', JSON.stringify(typers));
  });

  io.emit('usersLoggeds', JSON.stringify(connectedUsers));

  const messages = await cache.recover<any>(user);

  if (messages) {
    io.to(connectedUsers[user]).emit('messagesCache', JSON.stringify(messages));
    await cache.invalidate(user);
  }
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

  console.warn(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error ',
  });
});

http.listen(port, () => console.log(`🔥 Server is running in port ${port}`));
