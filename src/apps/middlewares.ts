import { NextFunction, Request, Response } from "express";
import isEmpty from "lodash/isEmpty";
import jwt from "jsonwebtoken";

import { JWT_SECRET } from "../config/jwtsecret";

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")!;
    if (isEmpty(token)) {
        return res.status(403).json({
            success: false,
            data: {},
            message: "Token not exist",
        });
    }
    const splitBearerToken = token.split(" ");
    jwt.verify(splitBearerToken[1].trim(), JWT_SECRET, { algorithms: ["HS512"] }, (err, payload) => {
        if (err) {
            return res.status(500).json({
                success: false,
                data: {},
                message: `Auth error: ${err}`,
            });
        }
        // Set the session on response.locals object for routes to access
        res.locals = {
            ...res.locals,
            userId: payload?.id,
            role: payload?.role,
        };
        // Request has a valid or renewed session. Call next to continue to the authenticated route handler
        next();
    });
};
