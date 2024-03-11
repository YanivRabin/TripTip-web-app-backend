import express from 'express';
const router = express.Router();
import MessageController from '../controller/message_controller';

router.post("/addMessage", MessageController.addMessage);
router.post("/getMessage", MessageController.getMessages);

export = router;