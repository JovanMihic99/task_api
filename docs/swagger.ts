import swaggerUi from "swagger-ui-express";
import express from "express";
import YAML from "yamljs";
import path from "path";

const setupSwagger = (app: express.Application) => {
  const swaggerDocument = YAML.load(path.join(__dirname, "./swagger.yaml"));
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
};

export default setupSwagger;
