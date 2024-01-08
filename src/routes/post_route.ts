import express from 'express';
const router = express.Router();
import PostController from '../controller/post_controller';
import authenticate from '../common/auth_middleware';


router.get('/', authenticate, PostController.getAllPosts);
router.get('/:id', authenticate, PostController.getPostsByOwner);
router.post('/', authenticate, PostController.createPost);
router.put('/:id', authenticate, PostController.updatePost);
router.delete('/:id', authenticate, PostController.deletePost);

export = router;