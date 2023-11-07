import { RequestHandler, Router } from "express";
import { FarmsController } from "modules/farms/farms.controller";

const router = Router();
const farmsController = new FarmsController();

/**
 * @openapi
 * '/api/farms':
 *  get:
 *     tags:
 *       - Farm
 *     summary: List Farms
 *     parameters:
 *      - in: query
 *        name: sort
 *        description: Sort order
 *        schema:
 *          type: string
 *          enum: [name, date, driving_distance]
 *          default: name
 *        required: true
 *      - in: query
 *        name: page
 *        description: Page number
 *        schema:
 *          type: number
 *          default: 1
 *        required: true
 *      - in: query
 *        name: pageSize
 *        description: Number of records on each page
 *        schema:
 *          type: number
 *          default: 10
 *        required: true
 *      - in: query
 *        name: outliers
 *        description: Yield of a farm is 30% below or above of the average yield of all farms
 *        schema:
 *          type: string
 *          enum: [TRUE, FALSE]
 *          default: TRUE
 *        required: true
 *     responses:
 *      201:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ListFarmDto'
 *      400:
 *        description: Bad request
 *      404:
 *        description: Not Found
 */
router.get("/", farmsController.list.bind(farmsController) as RequestHandler);

/**
 * @openapi
 * '/api/farms':
 *  post:
 *     tags:
 *       - Farm
 *     summary: Create a farm
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              type: object
 *              $ref: '#/components/schemas/CreateFarmDto'
 *     responses:
 *      201:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/FarmDto'
 *      400:
 *        description: Bad request
 */
router.post("/", farmsController.create.bind(farmsController) as RequestHandler);

export default router;
