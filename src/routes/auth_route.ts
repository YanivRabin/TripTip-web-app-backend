import express from 'express';
const router = express.Router();
import AuthController from '../controller/auth_controller';
import authenticate from '../common/auth_middleware';


router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/logout',authenticate , AuthController.logout);
router.post('/refreshToken', AuthController.refreshToken);

export = router;