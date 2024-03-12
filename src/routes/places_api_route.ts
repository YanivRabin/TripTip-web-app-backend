import express from 'express';
import {getRandomLocatonWithReviews} from '../controller/places_api_controller';
const router = express.Router();

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
router.get('/review', getRandomLocatonWithReviews);
// #endregion

export = router;
