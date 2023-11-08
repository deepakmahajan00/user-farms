import { Express, Request, Response } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import config from "./config";

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "User Farms",
      version: "0.1.0",
      description: "This is a simple boilerplate for user farms with Express and documented with Swagger",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          in: "header",
          name: "Authorization",
          description: "Bearer token to access these api endpoints",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    servers: [
      {
        url: `http://localhost:${config.APP_PORT}`,
      },
    ],
  },
  apis: ["./src/routes/*.routes.ts", "./src/modules/**/dto/*.dto.ts"],  
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app: Express) {
  // Swagger page
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Docs in JSON format
  app.get("/docs.json", (_: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Accept", "application/json");
    res.send(swaggerSpec);
  });

  console.log(`Swagger is available on http://localhost:${config.APP_PORT}/docs`);
}

export default swaggerDocs;
