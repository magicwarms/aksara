import { NextFunction, Request, Response } from "express";

import * as ToneService from "./tone.service";
import { queryFindToneData } from "./tone.interface";

export const getAllTone = async (req: Request<{}, {}, {}, queryFindToneData>, res: Response, _next: NextFunction) => {
    const isActive = req.query.isActive;
    const category = req.query.category;
    if (!category) {
        return res.status(422).json({
            success: false,
            data: null,
            message: `Category ID is required`,
        });
    }
    const tones = await ToneService.getAllTone(isActive, category);
    return res.status(200).json({
        success: true,
        data: tones,
        message: "Tone data found",
    });
};

export const storeOrUpdateTone = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const toneId: string = req.body.id;
        const status: string = toneId ? "updated" : "saved";
        const storeOrUpdateTone = await ToneService.storeOrUpdateTone(req.body);
        if (storeOrUpdateTone instanceof Array) {
            return res.status(422).json({
                success: false,
                data: storeOrUpdateTone,
                message: `Validation error`,
            });
        }
        return res.status(200).json({
            success: true,
            data: storeOrUpdateTone,
            message: `Tone data successfully ${status}`,
        });
    } catch (err) {
        next(err);
    }
};

export const deleteTone = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const toneId = req.body.id;
        if (!toneId) {
            return res.status(422).json({
                success: false,
                data: null,
                message: `Tone ID is required`,
            });
        }
        const deleteTone = await ToneService.deleteTone(toneId);
        if (!deleteTone.affected) {
            return res.status(200).json({
                success: true,
                data: null,
                message: "Tone data not successfully deleted",
            });
        }
        return res.status(200).json({
            success: true,
            data: null,
            message: "Tone data successfully deleted",
        });
    } catch (err) {
        next(err);
    }
};
