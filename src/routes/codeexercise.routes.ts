import { RequestHandler, Router } from "express";
import { CodeexercisesController } from "modules/codeexercises/codeexercises.controller";

const router = Router();
const codeexercisesController = new CodeexercisesController();

/**
 * @openapi
 * '/api/codeexercises/transform':
 *  post:
 *     tags:
 *       - CodeExercises
 *     summary: Transform array to containing number and strings. e.g ['super','20.5','test','23'] -> ['super',20.5,'test',23]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *            schema:
 *              type: object
 *              properties:
 *                inputArray:
 *                   type: array
 *                   required: true
 *                   default: ['super','20.5','test','23']
 *     responses:
 *      200:
 *        description: Success
 *      400:
 *        description: Bad request
 */
router.post("/transform", codeexercisesController.transform.bind(codeexercisesController) as RequestHandler);

/**
 * @openapi
 * '/api/codeexercises/stringCheck':
 *  get:
 *     tags:
 *       - CodeExercises
 *     summary: Check if string contains number
 *     parameters:
 *      - in: query
 *        name: inputString
 *        description: String which want to check.
 *        schema:
 *          type: string
 *          default: test-string23
 *        required: true
 *     responses:
 *      200:
 *        description: Success
 *      400:
 *        description: Bad request
 */
router.get("/stringCheck", codeexercisesController.stringCheck.bind(codeexercisesController) as RequestHandler);

/**
 * @openapi
 * '/api/codeexercises/listFileNames':
 *  get:
 *     tags:
 *       - CodeExercises
 *     summary: Return all file names with provided extension
 *     parameters:
 *      - in: query
 *        name: folderName
 *        description: Name of folder in which files need to search. Considering this folder always exists
 *        schema:
 *          type: string
 *          default: files
 *        required: true
 *      - in: query
 *        name: extension
 *        description: Search files with this extension in given folder
 *        schema:
 *          type: string
 *          default: CSV
 *        required: true
 *     responses:
 *      201:
 *        description: Success
 *      400:
 *        description: Bad request
 */
router.get("/listFileNames", codeexercisesController.listFileNames.bind(codeexercisesController) as RequestHandler);

export default router;
