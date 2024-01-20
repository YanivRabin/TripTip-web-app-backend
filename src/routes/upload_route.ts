import express from 'express';
const router = express.Router();
import UploadController from '../controller/upload_controller';
import authenticate from '../common/auth_middleware';


router.post('/userPhoto/:id', authenticate, UploadController.uploadUserPhoto);
router.post('/postPhoto/:postId', authenticate, UploadController.uploadPostPhoto);

export = router;