import express from 'express';
const router = express.Router();
import PostController from '../controller/post_controller';
import authenticate from '../common/auth_middleware';


router.get('/getAllPosts', authenticate, PostController.getAllPosts);
router.get('/getPostByOwner/:id', authenticate, PostController.getPostsByOwner);
router.get('/postId/:postId', authenticate, PostController.getPostById);
router.get('/getComments/:postId', authenticate, PostController.getPostComments);
router.post('/createPost', authenticate, PostController.createPost);
router.put('/updatePost/:id', authenticate, PostController.updatePost);
router.put('/createComment/:postId', authenticate, PostController.commentPost);
router.delete('/deletePost/:id', authenticate, PostController.deletePost);

export = router;