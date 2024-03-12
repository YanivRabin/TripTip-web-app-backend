"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const places_api_controller_1 = require("../controller/places_api_controller");
const router = express_1.default.Router();
// #region review GET request 
/**
 * Retrieves a random location with reviews.
 *
 * @swagger
 * /api/review:
 *   get:
 *     summary: Retrieve a random location with reviews
 *     description: |
 *       Retrieves a random location from a predefined list of locations with reviews.
 *       Fetches tips for the selected location using the Google Places API.
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 tips:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["Tip 1", "Tip 2", ...]
 *       400:
 *         description: Bad request
 */
router.get('/review', places_api_controller_1.getRandomLocatonWithReviews);
module.exports = router;
//# sourceMappingURL=places_api_route.js.map