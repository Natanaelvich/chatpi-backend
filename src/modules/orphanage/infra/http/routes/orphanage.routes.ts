import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import OrphanageController from '../controllers/OrphanageController';

const orphanageController = new OrphanageController();

const orphanageRouter = Router();

orphanageRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      about: Joi.string().required(),
      instructions: Joi.string().required(),
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
      open_hours: Joi.string().required(),
      open_on_weekends: Joi.boolean().required(),
    },
  }),
  orphanageController.create,
);

export default orphanageRouter;
