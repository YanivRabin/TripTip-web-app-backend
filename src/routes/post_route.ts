import express from 'express';
const router = express.Router();
import PostController from '../controller/post_controller';
import authenticate from '../common/auth_middleware';

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


// #region post routes

// #region create post request
/**
 * @swagger
 * /post/createPost:
 *  post:
 *      summary: Create a new post, photo or description is required
 *      tags: [Posts]
 *      security:
 *         - bearerAuth: []
 *      requestBody:
 *         required: true
 *         content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Post'
 *      responses:
 *         200:
 *          description: Post created successfully
 *          content:
 *              application/json:
 *                 schema:
 *                  $ref: '#/components/schemas/Post'
 *         400:
 *          description: description or photo is required
 *         401:
 *          description: Unauthorized, user not found
 *         500:
 *          description: Internal server error
 */
router.post('/createPost', authenticate, PostController.createPost);
// #endregion

// #endregion


// #region get routes

// #region get all posts request
/**
 * @swagger
 * /post/getAllPosts:
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
router.get('/getAllPosts', authenticate, PostController.getAllPosts);
// #endregion

// #region get posts by owner request
/**
 * @swagger
 * /post/{id}:
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
router.get('/:id', authenticate, PostController.getPostsByOwner);
// #endregion

// #region get post by id request
/**
 * @swagger
 * /post/postId/{postId}:
 *  get:
 *      summary: Get post by ID
 *      tags: [Posts]
 *      security:
 *         - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: postId
 *            schema:
 *              type: string
 *            required: true
 *            description: Post ID
 *      responses:
 *         200:
 *          description: Post found
 *          content:
 *              application/json:
 *                 schema:
 *                  $ref: '#/components/schemas/Post'
 *         401:
 *          description: Unauthorized, user not found
 *         500:
 *          description: Internal server error
 */
router.get('/postId/:postId', authenticate, PostController.getPostById);
// #endregion

// #region get post comments request
/**
 * @swagger
 * /post/getPostComments/{postId}:
 *   get:
 *     summary: Get post comments by post ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Comments found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Comment'
 *       401:
 *         description: Unauthorized, user not found
 *       500:
 *         description: Internal server error
 */
router.get('/post/getPostComments/:postId', authenticate, PostController.getPostComments);
// #endregion

// #endregion


// #region put routes

// #region update put request
/**
 * @swagger
 * /post/updatePost/{id}:
 *  put:
 *      summary: Update post by ID, photo or description is required
 *      tags: [Posts]
 *      security:
 *         - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: Post ID
 *      requestBody:
 *         required: true
 *         content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Post'
 *      responses:
 *         200:
 *          description: Post updated successfully
 *          content:
 *              application/json:
 *                 schema:
 *                  $ref: '#/components/schemas/Post'
 *         400:
 *          description: description or photo is required
 *         401:
 *          description: Unauthorized, user not found
 *         500:
 *          description: Internal server error
 */
router.put('/post/updatePost/:id', authenticate, PostController.updatePost);
// #endregion

// #region comment put request
/**
 * @swagger
 * /post/commentOnPost{postId}:
 *   put:
 *     summary: Comment post by ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
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
 *     responses:
 *       200:
 *         description: Comment added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       401:
 *         description: Unauthorized, user not found
 *       500:
 *         description: Internal server error
 */
router.put('/post/commentOnPost/:postId', authenticate, PostController.commentPost);
// #endregion

// #endregion


// #region delete routes

// #region delete post request
/**
 * @swagger
 * /post/deletePost/{id}:
 *  delete:
 *      summary: Delete post by ID
 *      tags: [Posts]
 *      security:
 *         - bearerAuth: []
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: Post ID
 *      responses:
 *         200:
 *          description: Post deleted successfully
 *         401:
 *          description: Unauthorized, user not found
 *         500:
 *          description: Internal server error
 */
router.delete('/post/deletePost/:id', authenticate, PostController.deletePost);
// #endregion

// #endregion


// #endregion

export = router;