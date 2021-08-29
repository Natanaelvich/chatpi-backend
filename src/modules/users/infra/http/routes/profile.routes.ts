import { celebrate, Joi, Segments } from 'celebrate';
import { Router } from 'express';
import ProfileController from '../controllers/ProfileController';
import UpdateClerkController from '../controllers/UpdateClerkController';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const profileController = new ProfileController();
const updateClerkController = new UpdateClerkController();

const profileRouter = Router();

profileRouter.use(ensureAuthenticated);

profileRouter.put(
  '/update',
  celebrate({
    [Segments.BODY]: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string(),
      name: Joi.string(),
      old_password: Joi.string().when('password', {
        is: (val: string) => !!val,
        then: Joi.string().required(),
        otherwise: Joi.string(),
      }),
    }),
  }),
  profileController.update,
);

profileRouter.put(
  '/update/clerk',
  celebrate({
    [Segments.BODY]: Joi.object({
      clerk: Joi.string().required(),
    }),
  }),
  updateClerkController.update,
);
profileRouter.get('/', profileController.show);

export default profileRouter;
