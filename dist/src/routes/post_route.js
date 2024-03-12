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
*  schemas:
*      Post:
*          type: object
*          required:
*              - owner
*          properties:
*              owner:
*                  type: string
*                  description: Owner ID
*              description:
*                  type: string
*                  description: Post content
*              photo:
*                  type: string
*                  description: Post photo
*              comments:
*                  type: array
*                  items:
*                      type: object
*                      properties:
*                          owner:
*                              type: string
*                              description: Owner ID
*                          content:
*                              type: string
*                              description: Comment content
*          example:
*              owner: '60b0f2c3e4a6a40015c8c9b5'
*              description: 'Welcome to my first post!'
*              photo: 'https://picsum.photos/200/300'
*              comments: [{
*                  owner: '60b0f2c3e4a6a40015c8c9b5',
*                  content: 'Beutiful!'
*              }]
*/
/**
 * @swagger
 * components:
 *   schemas:
 *     Comment:
 *       type: object
 *       required:
 *         - owner
 *         - comment
 *       properties:
 *         owner:
 *           type: string
 *           description: User ID
 *         comment:
 *           type: string
 *       example:
 *         owner: '60b0f2c3e4a6a40015c8c9b5'
 *         comment: 'Beautiful!'
 */
// #endregion
// #region routes
// #region getAllPosts GET request
/**
 * @swagger
 * /getAllPosts:
 *  get:
 *      summary: Get all posts
 *      tags: [Posts]
 *      security:
 *         - bearerAuth: []
 *      responses:
 *         200:
 *          description: Posts found
 *          content:
 *              application/json:
 *                 schema:
 *                  $ref: '#/components/schemas/Post'
 *         401:
 *          description: Unauthorized, user not found
 *         500:
 *          description: Internal server error
 */
router.get('/getAllPosts', auth_middleware_1.default, post_controller_1.default.getAllPosts);
// #endregion
// #region getPostByOwner GET request
/**
 * @swagger
 * /getPostByOwner/{id}:
 *  get:
 *      summary: Get all posts by owner 'ID'
 *      tags: [Posts]
 *      security:
 *         - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: Owner ID
 *      responses:
 *         200:
 *          description: Posts found
 *          content:
 *              application/json:
 *                 schema:
 *                  $ref: '#/components/schemas/Post'
 *         401:
 *          description: Unauthorized, user not found
 *         500:
 *          description: Internal server error
 */
router.get('/getPostByOwner/:id', auth_middleware_1.default, post_controller_1.default.getPostsByOwner);
// #endregion
// #region getPostById GET request
/**
 * @swagger
 * /postId/{postId}:
 *   get:
 *     summary: Get post by ID
 *     description: Retrieves a post by post ID.
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: Post ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       401:
 *         description: Unauthorized, post not found
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.get('/postId/:postId', auth_middleware_1.default, post_controller_1.default.getPostById);
// #endregion
// #region getComments POST request
/**
 * @swagger
 * /getComments/{postId}:
 *   get:
 *     summary: Get comments by post ID
 *     description: Retrieves comments by post ID.
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: Post ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved comments
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       401:
 *         description: Unauthorized, comments not found
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.get('/getComments/:postId', auth_middleware_1.default, post_controller_1.default.getPostComments);
// #endregion
// #region createPost PUT request
/**
 * @swagger
 * /createPost:
 *   post:
 *     summary: Create a new post
 *     description: Create a new post.
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully created post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       401:
 *         description: Unauthorized, user not found
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/createPost', auth_middleware_1.default, post_controller_1.default.createPost);
// #endregion
// #region updatePost PUT request
/**
 * @swagger
 * /updatePost/{id}:
 *   put:
 *     summary: Update a post
 *     description: Update a post by post ID.
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully updated post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       401:
 *         description: Unauthorized, post not found
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.put('/updatePost/:id', auth_middleware_1.default, post_controller_1.default.updatePost);
// #endregion
// #region createComment PUT request
/**
 * @swagger
 * /createComment/{postId}:
 *   put:
 *     summary: Create a new comment
 *     description: Create a new comment by post ID.
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: Post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Comment'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully created comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       401:
 *         description: Unauthorized, post not found
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.put('/createComment/:postId', auth_middleware_1.default, post_controller_1.default.commentPost);
// #endregion
// #region deletePost DELETE request
/**
 * @swagger
 * /deletePost/{id}:
 *   delete:
 *     summary: Delete a post
 *     description: Delete a post by post ID.
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Post ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully deleted post
 *       401:
 *         description: Unauthorized, post not found
 *       500:
 *         description: Internal server error
 */
router.delete('/deletePost/:id', auth_middleware_1.default, post_controller_1.default.deletePost);
module.exports = router;
//# sourceMappingURL=post_route.js.map