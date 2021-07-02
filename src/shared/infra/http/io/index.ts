import { Server } from 'socket.io';
import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import RedisCacheProvider from '@shared/container/providers/CacheProvider/implementations/RedisCacheProvider';

const { ONESIGNAL_KEY } = process.env;
const { ONESIGNAL_TOKEN_API } = process.env;

const iochat = (io: Server, app: any): void => {
  const cache = new RedisCacheProvider();
  const typers: Record<string, string> = {};
  const connectedUsers: Record<string, string> = {};

  app.use((request: Request, _: Response, next: NextFunction) => {
    request.io = io;
    request.connectedUsers = connectedUsers;

    return next();
  });

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
          await cache.save(dataMessage.toUser, [
            ...messages,
            { ...dataMessage },
          ]);
        } else {
          await cache.save(dataMessage.toUser, [{ ...dataMessage }]);
        }

        const player_id_onesignal = await cache.recover<any>(
          `${dataMessage.toUser}:player_id_onesignal`,
        );
        if (player_id_onesignal) {
          try {
            await axios.post(
              'https://onesignal.com/api/v1/notifications',
              {
                app_id: ONESIGNAL_KEY,
                include_player_ids: [player_id_onesignal],
                headings: { en: dataMessage.name },
                contents: { en: dataMessage.message },
                large_icon: dataMessage.largeIcon,
              },
              {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Basic ${ONESIGNAL_TOKEN_API}`,
                },
              },
            );
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

    socketIo.on('player_id_onesignal', async id => {
      await cache.save(`${user}:player_id_onesignal`, id);
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
      io.to(connectedUsers[user]).emit(
        'messagesCache',
        JSON.stringify(messages),
      );
      await cache.invalidate(user);
    }
  });
};

export default iochat;
