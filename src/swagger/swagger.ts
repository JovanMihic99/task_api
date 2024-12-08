import swaggerUi from "swagger-ui-express";
import express from "express";
import YAML from "yamljs";
import path from "path";

const setupSwagger = (app: express.Application) => {
  try{
    const swaggerDocument = YAML.load(path.join(__dirname, "../../docs/swagger.yaml"));
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }catch(error){
    console.error("Could not load swagger documentation: ",error);
  }
  
};

export default setupSwagger;
