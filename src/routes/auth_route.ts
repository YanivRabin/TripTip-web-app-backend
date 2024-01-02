import express from 'express';
const router = express.Router();
import AuthController from '../controller/auth_controller';


// router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
// router.post('/logout', auth.logout);

export = router;