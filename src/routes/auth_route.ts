import express from 'express';
const router = express.Router();
import AuthController from '../controller/auth_controller';
import authenticate from '../common/auth_middleware';


router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/googleLogin', AuthController.findOrCreateGoogleUser);
router.put('/changeProfilePicture',authenticate, AuthController.changeProfilePicture)
router.put('/changeName',authenticate, AuthController.changeName)
router.get('/logout', AuthController.logout);
router.get('/refreshToken', AuthController.refreshToken);
router.get('/userInfo', authenticate, AuthController.userInfo);
router.get('/getAllUsers', authenticate, AuthController.allUsers);

export = router;