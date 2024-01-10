"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const post_controller_1 = __importDefault(require("../controller/post_controller"));
const auth_middleware_1 = __importDefault(require("../common/auth_middleware"));
router.get('/', auth_middleware_1.default, post_controller_1.default.getAllPosts);
router.get('/:id', auth_middleware_1.default, post_controller_1.default.getPostsByOwner);
router.get('/postId/:postId', auth_middleware_1.default, post_controller_1.default.getPostById);
router.get('/comment/:postId', auth_middleware_1.default, post_controller_1.default.getPostComments);
router.post('/', auth_middleware_1.default, post_controller_1.default.createPost);
router.put('/:id', auth_middleware_1.default, post_controller_1.default.updatePost);
router.put('/comment/:postId', auth_middleware_1.default, post_controller_1.default.commentPost);
router.delete('/:id', auth_middleware_1.default, post_controller_1.default.deletePost);
module.exports = router;
//# sourceMappingURL=post_route.js.map