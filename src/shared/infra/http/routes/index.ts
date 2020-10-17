import locationRouter from '@modules/locations/infra/http/routes/location.routes';
import orphanageRouter from '@modules/orphanage/infra/http/routes/orphanage.routes';
import sessionsRouter from '@modules/users/infra/http/routes/sessions.routes';
import usersRouter from '@modules/users/infra/http/routes/users.routes';
import { Router } from 'express';

const routes = Router();

routes.use('/sessions', sessionsRouter);
routes.use('/users', usersRouter);
routes.use('/orphanages', orphanageRouter);
routes.use('/locations', locationRouter);

export default routes;
