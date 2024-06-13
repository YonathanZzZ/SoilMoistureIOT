import {Router} from 'express';
import passport from 'passport';
import {registerWithPassword, login, deleteUser, updateUserPassword, updateUserEmail, logoutUser} from '../controllers/user.controller';
import { isAuthenticated } from '../middleware/auth.middleware';
const router = Router();

router.post('/register/password', registerWithPassword);
router.delete('/', isAuthenticated, deleteUser);
router.patch('/password', isAuthenticated, updateUserPassword);
router.patch('/email', isAuthenticated, updateUserEmail);
router.post('/login/password', passport.authenticate('local'), login);
router.post('/logout', isAuthenticated, logoutUser);

export default router;