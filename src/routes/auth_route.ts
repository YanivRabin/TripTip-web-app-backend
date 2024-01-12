import express from 'express';
const router = express.Router();
import AuthController from '../controller/auth_controller';
// import authenticate from '../common/auth_middleware';

// #region route configuration
/**
* @swagger
* tags:
*   name: Authentication
*   description: The Authentication API
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

// #region user schema
/**
* @swagger
* components:
*  schemas:
*      User:
*          type: object
*          required:
*              - email
*              - password
*              - name
*          properties:
*              email:
*                  type: string
*                  description: Email for the user, needs to be unique
*              password:
*                  type: string
*                  description: Password for the user
*              name:
*                  type: string
*                  description: Name for the user
*              photo:
*                  type: string
*                  description: Photo for the user
*              posts:
*                  type: array
*                  items:
*                      type: object
*                      properties:
*                          post:
*                              type: string
*                              description: Post ID
*          example:
*              email: 'joni910.malki@gmail.com'
*              password: '123456'
*              name: 'Joni Malki'
*/
// #endregion

// #region tokens schema
/**
* @swagger
* components:
*  schemas:
*      Tokens:
*          type: object
*          required:
*              - accessToken
*              - refreshToken
*          properties:
*              accessToken:
*                  type: string
*                  description: Access token for the user
*              refreshToken:
*                  type: string
*                  description: Refresh token for the user
*          example:
*              accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
*              refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9'
*/
// #endregion 

// #endregion

// #region routes

// #region post routes

// #region register request
/**
* @swagger
* /auth/register:
*   post:
*       summary: Register a new user
*       tags: [Authentication]
*       requestBody:
*           required: true
*           content:
*               application/json:
*                   schema:
*                       $ref: '#/components/schemas/User'
*       responses:
*           201:
*               description: The user was successfully registered
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/User'
*           400:
*               description: Missing email, password or name
*           406:
*               description: Email already exists
*           500:
*               description: Internal server error
*/ 
router.post('/register', AuthController.register);
// #endregion

// #region login request
/**
* @swagger
* /auth/login:
*   post:
*       summary: Login user
*       tags: [Authentication]
*       requestBody:
*           required: true
*           content:
*               application/json:
*                   schema:
*                       $ref: '#/components/schemas/User'
*       responses:
*           200:
*               description: The user was successfully logged in, returns tokens
*               content:
*                   application/json:
*                       schema:
*                           $ref: '#/components/schemas/Tokens'
*           400:
*               description: Missing email or password
*           401:
*               description: Email or password incorrect
*           500:
*               description: Internal server error
*/
router.post('/login', AuthController.login);
// #endregion

// #endregion

// #region get routes

// #region logout request
/**
 * @swagger
 * /auth/logout:
 *  get:
 *    summary: Logout user
 *    tags: [Authentication]
 *    security:
 *     - bearerAuth: []
 *    responses:
 *     200:
 *      description: The user was successfully logged out
 *     401:
 *      description: Unauthorized
 *     500:
 *      description: Internal server error
 */
router.get('/logout', AuthController.logout);
// #endregion

// #region refresh token request
/**
 * @swagger
 * /auth/refreshToken:
 *  get:
 *    summary: Refresh user token
 *    tags: [Authentication]
 *    security:
 *     - bearerAuth: []
 *    responses:
 *     200:
 *      description: The user token was successfully refreshed, returns tokens
 *      content:
 *          application/json:
 *              schema:
 *                  $ref: '#/components/schemas/Tokens'
 *     401:
 *      description: Unauthorized
 *     500:
 *      description: Internal server error
 */
router.get('/refreshToken', AuthController.refreshToken);
// #endregion

// #endregion

// #endregion

export = router;