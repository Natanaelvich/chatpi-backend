import { Router } from 'express';
import UsersUpdateController from '../controllers/UsersUpdateController';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const userUpdateController = new UsersUpdateController();

const profileRouter = Router();

profileRouter.use(ensureAuthenticated);

profileRouter.put('/update', userUpdateController.update);
profileRouter.get('/', userUpdateController.show);

export default profileRouter;
