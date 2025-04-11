import express from "express";
require("dotenv").config({ path: "./config/config.env" });
import { createDatabaseConnection } from "./config";
import App from "./services/ExpressApp"

const port = process.env.PORT || process.env.PORT_NUMBER;

const StartServer = async () => {
  const app = express();
  // Database Connection
  await createDatabaseConnection();

  await App(app);

  app.listen(port, () => {
    console.clear();
    console.log(`Food Delivery Server is running on port ${port}`);
  });

}


StartServer();