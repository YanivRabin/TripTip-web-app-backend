"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const post_controller_1 = __importDefault(require("../controller/post_controller"));
const auth_middleware_1 = __importDefault(require("../common/auth_middleware"));
router.get('/getAllPosts', auth_middleware_1.default, post_controller_1.default.getAllPosts);
router.get('/getPostByName/:name', auth_middleware_1.default, post_controller_1.default.getPostsByName);
router.get('/postId/:postId', auth_middleware_1.default, post_controller_1.default.getPostById);
router.get('/getComments/:postId', auth_middleware_1.default, post_controller_1.default.getPostComments);
router.post('/createPost', auth_middleware_1.default, post_controller_1.default.createPost);
router.put('/updatePost/:id', auth_middleware_1.default, post_controller_1.default.updatePost);
router.put('/createComment/:postId', auth_middleware_1.default, post_controller_1.default.commentPost);
router.delete('/deletePost/:postId', auth_middleware_1.default, post_controller_1.default.deletePost);
module.exports = router;
//# sourceMappingURL=post_route.js.map