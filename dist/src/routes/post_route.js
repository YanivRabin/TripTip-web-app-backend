"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const post_controller_1 = __importDefault(require("../controller/post_controller"));
const auth_middleware_1 = __importDefault(require("../common/auth_middleware"));
// #region route configuration
/**
* @swagger
* tags:
*   name: Posts
*   description: Post management routes
*/
/**
 * @swagger
 * components:
 *  securitySchemes:
 *     bearerAuth:
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT
 */
// #endregion
// #region schemas
/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the post.
 *         description:
 *           type: string
 *           description: Optional description for the post.
 *         photo:
 *           type: string
 *           description: URL to the post's photo.
 *         profilePic:
 *           type: string
 *           description: URL to the post's profile picture.
 *           default: null
 *         comments:
 *           type: array
 *           description: Array of comments made on the post.
 *           items:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *                 description: The user who made the comment.
 *               comment:
 *                 type: string
 *                 description: The content of the comment.
 *       required:
 *         - name
 *         - comments
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       properties:
 *         user:
 *           type: string
 *           description: The user who made the comment.
 *         comment:
 *           type: string
 *           description: The content of the comment.
 *       required:
 *         - user
 *         - comment
 */
// #endregion
// #region API requests
// #region getAllPosts GET request
/**
 * Retrieves all posts.
 *
 * @swagger
 * /posts/getAllPosts:
 *   get:
 *     summary: Retrieve all posts
 *     security:
 *       - bearerAuth: []
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       400:
 *         description: Bad request
 */
router.get('/getAllPosts', auth_middleware_1.default, post_controller_1.default.getAllPosts);
// #endregion
// #region getPostByName GET request
/**
 * Retrieves posts by name.
 *
 * @swagger
 * /posts/getPostByName/{name}:
 *   get:
 *     summary: Retrieve posts by name
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Name of the post to retrieve.
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *       401:
 *         description: No posts found for the given name
 *       400:
 *         description: Bad request
 */
router.get('/getPostByName/:name', auth_middleware_1.default, post_controller_1.default.getPostsByName);
// #endregion
// #region postId GET request
/**
 * Retrieves a post by ID.
 *
 * @swagger
 * /posts/postId/{postId}:
 *   get:
 *     summary: Retrieve a post by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the post to retrieve.
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       401:
 *         description: Post not found
 *       400:
 *         description: Bad request
 */
router.get('/postId/:postId', auth_middleware_1.default, post_controller_1.default.getPostById);
// #endregion
// #region getComments GET request
/**
 * Retrieves comments for a post by ID.
 *
 * @swagger
 * /posts/getComments/{postId}:
 *   get:
 *     summary: Retrieve comments for a post by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the post to retrieve comments for.
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       401:
 *         description: Post not found
 *       500:
 *         description: Internal Server Error
 */
router.get('/getComments/:postId', auth_middleware_1.default, post_controller_1.default.getPostComments);
// #endregion
// #region createPost POST request
/**
 * Creates a new post.
 *
 * @swagger
 * /posts/createPost:
 *   post:
 *     summary: Create a new post
 *     security:
 *       - bearerAuth: []
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the user creating the post.
 *               description:
 *                 type: string
 *                 description: The description of the post.
 *               photo:
 *                 type: string
 *                 format: binary
 *                 description: The photo associated with the post.
 *     responses:
 *       200:
 *         description: Successful creation of post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Bad request
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Description or photo is required
 *       401:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
router.post('/createPost', auth_middleware_1.default, post_controller_1.default.createPost);
// #endregion
// #region updatePost PUT request
/**
 * Updates a post by ID.
 *
 * @swagger
 * /posts/updatePost/{id}:
 *   put:
 *     summary: Update a post by ID
 *     security:
 *       - bearerAuth: []
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the post to update.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 description: The updated description of the post.
 *               photo:
 *                 type: string
 *                 format: binary
 *                 description: The updated photo associated with the post.
 *     responses:
 *       200:
 *         description: Successful update of post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Bad request
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Description or photo is required
 *       401:
 *         description: Post not found
 *       500:
 *         descript
*/
router.put('/updatePost/:id', auth_middleware_1.default, post_controller_1.default.updatePost);
// #endregion
// #region createComment PUT request
/**
 * Adds a comment to a post.
 *
 * @swagger
 * /posts/createComment/{postId}:
 *   put:
 *     summary: Add a comment to a post
 *     security:
 *       - bearerAuth: []
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the post to add a comment to.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: string
 *                 description: The user making the comment.
 *               comment:
 *                 type: string
 *                 description: The comment to be added.
 *     responses:
 *       200:
 *         description: Successful addition of comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       400:
 *         description: Bad request
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: User and comment are required
 *       401:
 *         description: Post not found
 *       500:
 *         description: Internal Server Error
 */
router.put('/createComment/:postId', auth_middleware_1.default, post_controller_1.default.commentPost);
// #endregion
// #region deletePost DELETE request
/**
 * Deletes a post.
 *
 * @swagger
 * /posts/deletePost/{postId}:
 *   delete:
 *     summary: Delete a post
 *     security:
 *       - bearerAuth: []
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the post to delete.
 *     responses:
 *       200:
 *         description: Successful deletion of post
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Post deleted
 *       401:
 *         description: Post or user not found
 *       500:
 *         description: Internal Server Error
 */
router.delete('/deletePost/:postId', auth_middleware_1.default, post_controller_1.default.deletePost);
module.exports = router;
//# sourceMappingURL=post_route.js.map