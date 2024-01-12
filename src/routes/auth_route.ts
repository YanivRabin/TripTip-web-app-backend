import express from 'express';
const router = express.Router();
import AuthController from '../controller/auth_controller';


router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/logout', AuthController.logout);
router.get('/refreshToken', AuthController.refreshToken);
router.get('/googleLogin', AuthController.googleLogin);
router.get('/google/callback', AuthController.googleCallback);

export = router;