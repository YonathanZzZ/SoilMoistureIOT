import {Router} from 'express';
import { addMeasurementToDevice, deleteMeasurementFromDevice, getAllMeasurementsOfDevice } from '../controllers/measurement.controller';
import { isAuthenticated } from '../middleware/auth.middleware';

const router = Router();

router.post('/', addMeasurementToDevice);
router.delete('/:id', isAuthenticated, deleteMeasurementFromDevice); //delete measurement by its id
router.get('/:uuid', isAuthenticated, getAllMeasurementsOfDevice); //get all measurements of a device identified by its uuid

export default router;
