import { Router } from 'express';

import AttendatesController from '../controllers/AttendatesController';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

const attendantesController = new AttendatesController();

const attendantesRouter = Router();

attendantesRouter.use(ensureAuthenticated);

attendantesRouter.get('/', attendantesController.index);

export default attendantesRouter;
