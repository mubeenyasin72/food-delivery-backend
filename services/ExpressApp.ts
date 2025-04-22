import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { AdminRoute, VandorRoute, ShoppingRoute, UserRoutes } from "../routes";
import { ApiError, INTERNAL_SERVER_ERROR, BAD_REQUEST, NOT_FOUND, ApiResponse } from "../utility";
import path from "path";

export default async (app: Application) => {

    app.use(cors());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use("/images", express.static(path.join(__dirname, "images")));


    //Routes
    app.use("/api/v1/admin", AdminRoute);
    app.use("/api/v1/vandor", VandorRoute);
    app.use("/api/v1/shopping", ShoppingRoute);
    app.use("/api/v1/user", UserRoutes)
    // Handle 404 errors
    app.use((req: Request, res: Response) => {
        res
            .status(NOT_FOUND)
            .json(
                new ApiResponse(
                    NOT_FOUND,
                    {},
                    `Can't find ${req.originalUrl} on the server!`
                )
            );
    });

    // Global Error Handler
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {

        if (err instanceof ApiError) {
            const { statusCode, message, error } = err;
            res.status(statusCode).json({
                error: {
                    message,
                    details: error.length > 0 ? error : undefined,
                },
            });
        } else {
            const status = (err as any).status || INTERNAL_SERVER_ERROR;
            const message =
                status >= BAD_REQUEST && status < INTERNAL_SERVER_ERROR
                    ? err.message || "Client Error"
                    : "Internal Server Error";

            // Customize response based on environment
            if (process.env.NODE_ENV === "development") {
                console.log({
                    message,
                    stack: err.stack,
                });

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
    return app;
}



