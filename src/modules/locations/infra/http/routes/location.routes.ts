import { Router } from 'express';
import LocationController from '../controllers/LocationController';

const locationController = new LocationController();

const locationRouter = Router();

locationRouter.get('/', locationController.index);
locationRouter.post('/', locationController.create);

export default locationRouter;
