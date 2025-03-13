import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { AdminRoute, VandorRoute } from "./routes";
import { ApiError, INTERNAL_SERVER_ERROR, BAD_REQUEST } from "./utility";
require("dotenv").config({ path: "./config/config.env" });
import {createDatabaseConnection} from "./config"
const app = express();
const port = process.env.PORT || process.env.PORT_NUMBER;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

//Routes
app.use("/api/v1/admin", AdminRoute);
app.use("/api/v1/vandor", VandorRoute);

// Database Connection
createDatabaseConnection();

// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);

  if (err instanceof ApiError) {
    const { statusCode, message, error } = err;
    res.status(statusCode).json({
      error: {
        message,
        details: error.length > 0 ? error : undefined,
      },
    });
  } else {
    // Error Handler
    const status = (err as any).status || INTERNAL_SERVER_ERROR;
    const message = status >= BAD_REQUEST && status < INTERNAL_SERVER_ERROR ? err.message || "Client Error" : "Internal Server Error";

    // Customize response based on environment
    if (process.env.NODE_ENV === "development") {
      res.status(status).json({
        error: {
          message,
          stack: err.stack,
        },
      });
    } else {
      res.status(status).json({
        error: {
          message,
        },
      });
    }
  }
});

app.listen(port, () => {
  console.clear()
  console.log(`Food Delivery Server is running on port ${port}`);
});