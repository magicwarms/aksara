import { Request, Response } from "express";

import rateLimit from "express-rate-limit";
import slowDown from "express-slow-down";

const rateLimiter = rateLimit({
    windowMs: 30 * 1000,
    max: 10,
    handler: (_req: Request, res: Response) => {
        return res.status(429).json({
            success: false,
            data: {},
            message: "Too many requests, please try again later.",
        });
    },
});

// Turunkan kecepatan response setelah request pertama
// Dalam rentang waktu 30 detik
// Pada endpoint api yang sama
const speedLimiter = slowDown({
    windowMs: 30 * 1000,
    delayAfter: 5,
    delayMs: 250,
});

export { rateLimiter, speedLimiter };
