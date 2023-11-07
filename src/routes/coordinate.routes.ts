import { RequestHandler, Router } from "express";
import { CoordinatesController } from "modules/coordinates/coordinates.controller";

const router = Router();
const coordinatesController = new CoordinatesController();

/**
 * @openapi
 * '/api/coordinates':
 *  post:
 *     tags:
 *       - Coordinate
 *     summary: Create a coordinate
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/CreateCoordinateDto'
 *     responses:
 *      201:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CoordinateDto'
 *      400:
 *        description: Bad request
 */
router.post("/", coordinatesController.create.bind(coordinatesController) as RequestHandler);

export default router;
