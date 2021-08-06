import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import { RefreshTokenController } from '../controllers/RefreshTokenController';
import SessionController from '../controllers/SessionController';

const sessionController = new SessionController();
const refreshTokenController = new RefreshTokenController();

const sessionsRouter = Router();

sessionsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  sessionController.create,
);

sessionsRouter.post('/refresh-token', refreshTokenController.create);

export default sessionsRouter;
