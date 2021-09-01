/**
 * Required External Modules
 */
import * as dotenv from "dotenv";
import express, { Application, NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import cluster from "cluster";
import os from "os";
import "reflect-metadata";
import { createConnection } from "typeorm";

import { rateLimiter, speedLimiter } from "./utilities/rateSpeedLimiter";
import router from "./routes";

dotenv.config();

const numCPUS = os.cpus().length;

/**
 * Set timezone
 */
process.env.TZ = "Asia/Jakarta";

// define var for current server time
const currentTime = new Date().toJSON().slice(0, 10).replace(/-/g, "/") + " " + new Date(Date.now()).toTimeString();
/**
 * App Variables
 */
if (!process.env.APP_PORT) {
    console.log(`Server exit without set PORT`);
    process.exit(1);
}

const PORT: number = parseInt(process.env.APP_PORT as string, 10);
const app: Application = express();

/**
 *  App Configuration
 */
app.use(helmet());
app.use(
    cors({
        origin: "*",
        optionsSuccessStatus: 200,
        methods: ["GET", "POST", "PUT", "DELETE"],
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", rateLimiter, speedLimiter, router);

app.get("/", (_req: Request, res: Response) =>
    res.status(200).json({
        success: true,
        data: {},
        message: "Hello world",
    })
);

// handle 404
app.use((_req: Request, res: Response) => {
    return res.status(404).json({
        success: true,
        data: {},
        message: "API route not found",
    });
});
// handle 500 Any error
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    return res.status(500).json({
        success: false,
        data: {},
        message: `Error! (${err.message})`,
    });
});

// ensures we close the server in the event of an error.
const setupCloseOnExit = (server: any) => {
    async function exitHandler(options = { exit: false }) {
        server.close(() => {
            if (options.exit) {
                console.info(`Server successfully closed at ${currentTime}`);
                process.exit(1);
            }
        });
    }

    // do something when app is closing
    process.on("exit", exitHandler);
    // catches ctrl+c event
    process.on("SIGINT", exitHandler.bind(null, { exit: true }));
    // catches "kill pid" (for example: nodemon restart)
    process.on("SIGUSR1", exitHandler.bind(null, { exit: true }));
    process.on("SIGUSR2", exitHandler.bind(null, { exit: true }));
    // catches uncaught exceptions
    process.on("uncaughtException", exitHandler.bind(null, { exit: true }));
};

/**
 * Server Activation
 */
const startServer = () => {
    const NodeAppInstanceEnvValue: number = parseInt(process.env.NODE_APP_INSTANCE as string, 10);
    const nodeAppInstancePort =
        process.env.NODE_ENV === "production" || process.env.NODE_ENV === "staging"
            ? PORT + NodeAppInstanceEnvValue
            : PORT;
    return new Promise((resolve) => {
        const server = app.listen(nodeAppInstancePort, () => {
            console.info(`⚡️[server]: Server is running at https://${process.env.APP_LINK}:${PORT} - ${currentTime}`);
            // this ensures that we properly close the server when the program exists
            setupCloseOnExit(server);
            // resolve the whole promise with the express server
            resolve(server);
        });
    });
};

/**
 * Setup server connection here
 */
const startServerCluster = async () => {
    console.info("Production server mode started!");
    // Activate cluster for production mode
    if (cluster.isPrimary) {
        console.info(`Master ${process.pid} is running`);
        for (let i = 0; i < numCPUS; i += 1) {
            cluster.fork();
        }
        cluster.on("exit", (worker, code) => {
            // If cluster crashed, start new cluster connection
            if (code !== 0 && !worker.exitedAfterDisconnect) {
                console.warn("Cluster crashed, starting new cluster");
                cluster.fork();
            }
        });
    } else {
        await createConnection();
        startServer()
            .then()
            .catch((err) => console.error(err));
    }
};

const startServerDevelopment = async () => {
    console.info("Development server mode started!");
    await createConnection();
    // activate if development mode
    startServer()
        .then()
        .catch((err) => console.error(err));
};

/**
 * Setup database connection here
 */
/**
 * Start server
 */
if (process.env.NODE_ENV === "development") {
    startServerDevelopment();
} else {
    startServerCluster();
}
