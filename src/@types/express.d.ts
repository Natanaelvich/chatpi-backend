import { Server } from 'socket.io';

declare global {
  namespace Express {
    export interface Request {
      user: {
        id: string;
      };
      io: Server;
      connectedUsers: any;
    }
  }
}
