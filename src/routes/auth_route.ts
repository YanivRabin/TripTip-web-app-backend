import express from 'express';
const router = express.Router();
import AuthController from '../controller/auth_controller';
import authenticate from '../common/auth_middleware';


router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/logout',authenticate , AuthController.logout);
router.get('/refreshToken', AuthController.refreshToken);

export = router;