import {Router} from 'express';
import { isAuthenticated } from '../middleware/auth.middleware';
import { addDeviceToUser, deleteDeviceFromUser, getAllUserDevices, updateUserDevice, getDeviceData } from '../controllers/device.controller';
const router = Router();

//get list of devices for a user (by user id)
router.get('/', isAuthenticated, getAllUserDevices);
router.get('/:uuid', isAuthenticated, getDeviceData);
router.post('/', isAuthenticated, addDeviceToUser);
router.delete('/:uuid', isAuthenticated, deleteDeviceFromUser);
router.patch('/:uuid', isAuthenticated, updateUserDevice);

export default router;