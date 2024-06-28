import {Router} from 'express';
import { addMeasurementToDevice, deleteMeasurementFromDevice, getAllMeasurementsOfDevice } from '../controllers/measurement.controller';
import { isAuthenticated } from '../middleware/auth.middleware';

const router = Router();

router.post('/', addMeasurementToDevice);
router.delete('/:uuid', isAuthenticated, deleteMeasurementFromDevice); 
router.get('/:uuid', isAuthenticated, getAllMeasurementsOfDevice); 

export default router;
