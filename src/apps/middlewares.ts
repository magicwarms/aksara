import { NextFunction, Request, Response } from 'express';
import isEmpty from 'lodash/isEmpty';
import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '../config/jwtsecret';

export const verifyToken = (req: Request, res: Response, next: NextFunction): Response | undefined | NextFunction => {
    const token = req.header('Authorization') ?? '';
    if (isEmpty(token)) {
        return res.status(403).json({
            success: false,
            data: {},
            message: "Token doesn't exist"
        });
    }
    const splitBearerToken = token.split(' ');
    jwt.verify(splitBearerToken[1].trim(), JWT_SECRET, { algorithms: ['HS512'] }, (err, payload) => {
        if (err) {
            return res.status(500).json({
                success: false,
                data: {},
                message: `Auth error: ${err}`
            });
        }
        // Set the session on response.locals object for routes to access
        res.locals = {
            ...res.locals,
            userId: payload?.id,
            role: payload?.role,
            email: payload?.email,
            fullname: payload?.fullname
        };
        // Request has a valid or renewed session. Call next to continue to the authenticated route handler
        next();
    });
};

export const verifyAdminAccess = (_req: Request, res: Response, next: NextFunction): Response | undefined => {
    console.log(res.locals);
    if (res.locals.role !== 'admin') {
        return res.status(403).json({
            success: false,
            data: {},
            message: "You don't have enough permission to access this API"
        });
    }
    next();
};
