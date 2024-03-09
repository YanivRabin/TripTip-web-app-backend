import express from 'express';
const router = express.Router();
import AuthController from '../controller/auth_controller';
import authenticate from '../common/auth_middleware';

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

// #region register POST request
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

// #region login POST request
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

// #region logout GET request
/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     description: Logs out a user by invalidating their token.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized, token not provided
 *       403:
 *         description: Forbidden, user not found
 *       500:
 *         description: Internal server error
 */
router.get('/logout', AuthController.logout);
// #endregion

// #region refreshToken GET request
/**
 * @swagger
 * /auth/refreshToken:
 *   post:
 *     summary: Refresh Access Token
 *     description: Refreshes the user's access token using a refresh token.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: New access and refresh tokens generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: New access token
 *                 refreshToken:
 *                   type: string
 *                   description: New refresh token
 *       401:
 *         description: Unauthorized, token not provided
 *       403:
 *         description: Forbidden, invalid request or token
 *       500:
 *         description: Internal server error
 */
router.get('/refreshToken', AuthController.refreshToken);
// #endregion

// #region userInfo GET request
/**
 * @swagger
 * /auth/userInfo:
 *   get:
 *     summary: Get User Information
 *     description: Retrieves information about the authenticated user.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized, user not authenticated
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.get('/userInfo', authenticate, AuthController.userInfo);
// #endregion

// #region googleLogin GET request
/**
 * @swagger
 * /auth/googleLogin:
 *   get:
 *     summary: Initiate Google login process
 *     description: Initiates the Google OAuth2 authentication process. Redirects the user to the Google login page.
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirects to the Google login page for authentication
 *       400:
 *         description: Bad request, missing or invalid parameters
 *       500:
 *         description: Internal server error
 */
router.get('/googleLogin', AuthController.googleLogin);
// #endregion

// #region googleCallback GET request
/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google login callback
 *     description: Handles the callback from Google after authentication. Redirects to the appropriate page based on authentication result.
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirects to the home page on successful authentication, or to the '/auth/googleLogin' route on failure
 *       400:
 *         description: Bad request, missing or invalid parameters
 *       500:
 *         description: Internal server error
 */
router.get('/google/callback', AuthController.googleCallback);
// #endregion

// #endregion
export = router;


/* add exampels !! */