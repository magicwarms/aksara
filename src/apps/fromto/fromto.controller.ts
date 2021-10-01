import { NextFunction, Request, Response } from 'express';

import * as FromToService from './fromto.service';
import { queryFindFromtoData } from './fromto.inteface';

export const getAllFromTo = async (
    req: Request<unknown, unknown, unknown, queryFindFromtoData>,
    res: Response
): Promise<Response> => {
    const isActive = req.query.isActive;
    const category = req.query.category;
    if (!category) {
        return res.status(422).json({
            success: false,
            data: null,
            message: `Category ID is required`
        });
    }
    const tones = await FromToService.getAllFromTo(isActive, category);
    return res.status(200).json({
        success: true,
        data: tones,
        message: 'From & To data found'
    });
};

export const storeOrUpdateFromTo = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<Response | undefined> => {
    try {
        const fromToId: string = req.body.id;
        const status: string = fromToId ? 'updated' : 'saved';
        const storeOrUpdateFromTo = await FromToService.storeOrUpdateFromTo(req.body);
        if (storeOrUpdateFromTo instanceof Array) {
            return res.status(422).json({
                success: false,
                data: storeOrUpdateFromTo,
                message: `Validation error`
            });
        }
        return res.status(200).json({
            success: true,
            data: storeOrUpdateFromTo,
            message: `From and To data successfully ${status}`
        });
    } catch (err) {
        next(err);
    }
};

export const deleteFromTo = async (req: Request, res: Response, next: NextFunction): Promise<Response | undefined> => {
    try {
        const fromToId = req.body.id;
        if (!fromToId) {
            return res.status(422).json({
                success: false,
                data: null,
                message: `From and To ID is required`
            });
        }
        const deleteFromTo = await FromToService.deleteFromTo(fromToId);
        if (!deleteFromTo.affected) {
            return res.status(200).json({
                success: true,
                data: null,
                message: 'From and To data not successfully deleted'
            });
        }
        return res.status(200).json({
            success: true,
            data: null,
            message: 'Tone data successfully deleted'
        });
    } catch (err) {
        next(err);
    }
};
