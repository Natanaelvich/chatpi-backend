import upload from '@config/upload';
import { Router } from 'express';
import multer from 'multer';
import OrphanageController from '../controllers/OrphanageController';

const orphanageController = new OrphanageController();

const uploader = multer(upload.multer);
const orphanageRouter = Router();

orphanageRouter.post('/', uploader.array('images'), orphanageController.create);
orphanageRouter.get('/', orphanageController.index);
orphanageRouter.get('/:orphanageId', orphanageController.show);

export default orphanageRouter;
