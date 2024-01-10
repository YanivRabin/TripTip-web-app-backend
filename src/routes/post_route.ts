import express from 'express';
const router = express.Router();
import PostController from '../controller/post_controller';
import authenticate from '../common/auth_middleware';


router.get('/', authenticate, PostController.getAllPosts);
router.get('/:id', authenticate, PostController.getPostsByOwner);
router.get('/postId/:postId', authenticate, PostController.getPostById);
router.get('/comment/:postId', authenticate, PostController.getPostComments);
router.post('/', authenticate, PostController.createPost);
router.put('/:id', authenticate, PostController.updatePost);
router.put('/comment/:postId', authenticate, PostController.commentPost);
router.delete('/:id', authenticate, PostController.deletePost);

export = router;