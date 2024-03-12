"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const auth_controller_1 = __importDefault(require("../controller/auth_controller"));
const auth_middleware_1 = __importDefault(require("../common/auth_middleware"));
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
// #region register POST request
/**
 * Registers a new user.
 *
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     description: Registers a new user with the provided email, password, and name.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user.
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *               name:
 *                 type: string
 *                 description: The name of the user.
 *     responses:
 *       201:
 *         description: Successful registration
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 accessToken:
 *                   type: string
 *                   description: An access token for the user session.
 *                 refreshToken:
 *                   type: string
 *                   description: A refresh token for the user session.
 *       400:
 *         description: Bad request
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: missing email, password, or name
 *       406:
 *         description: Not Acceptable
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Name already exists - choose a different name
 *       500:
 *         description: Internal Server Error
 */
router.post('/register', auth_controller_1.default.register);
// #endregion
router.post('/login', auth_controller_1.default.login);
router.post('/googleLogin', auth_controller_1.default.findOrCreateGoogleUser);
router.put('/changeProfilePicture', auth_middleware_1.default, auth_controller_1.default.changeProfilePicture);
router.put('/changeName', auth_middleware_1.default, auth_controller_1.default.changeName);
router.get('/logout', auth_controller_1.default.logout);
router.get('/refreshToken', auth_controller_1.default.refreshToken);
router.get('/userInfo', auth_middleware_1.default, auth_controller_1.default.userInfo);
router.get('/getAllUsers', auth_middleware_1.default, auth_controller_1.default.allUsers);
module.exports = router;
//# sourceMappingURL=auth_route.js.map