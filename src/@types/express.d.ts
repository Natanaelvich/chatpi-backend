/* eslint-disable @typescript-eslint/no-unused-vars */
import { Server } from 'socket.io';

declare global {
  namespace Express {
    export interface Request {
      user: {
        id: string;
      };
      io: Server;
      connectedUsers: Record<string, string>;
    }
  }
}
