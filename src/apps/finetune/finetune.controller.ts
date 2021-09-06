import { NextFunction, Request, Response } from "express";
import { deleteFile } from "../../utilities/file";

import logger from "../../config/logger";

import * as FineTuneService from "./finetune.service";

export const convert = async (req: Request, res: Response, next: NextFunction) => {
    if (res.locals.role !== "admin") {
        return res.status(401).json({
            success: false,
            data: {},
            message: "You don't have any role permission to access this API",
        });
    }
    try {
        const filePath = "temp/" + req.file?.filename;
        if (req.file?.mimetype !== "text/csv" && req.file?.mimetype !== "application/octet-stream") {
            deleteFile(filePath);
            return res.status(422).json({
                success: false,
                data: {},
                message: "Please upload csv file only",
            });
        }
        if (typeof req.body.isCSV === "undefined" || req.body.isCSV === null || req.body.isCSV === "") {
            return res.status(422).json({
                success: false,
                data: {},
                message: "CSV value is required",
            });
        }
        const convertProcess = await FineTuneService.convertCsvToJsonLine(req);
        if (!convertProcess) {
            return res.status(500).json({
                success: false,
                data: {},
                message: "Convert process error",
            });
        }
        return res.status(200).json({
            success: true,
            data: {},
            message: "Successfully Converted",
        });
    } catch (err) {
        logger.error(err);
        next(err);
    }
};

export const listUploadedOpenAIFile = async (_req: Request, res: Response, next: NextFunction) => {
    if (res.locals.role !== "admin") {
        return res.status(401).json({
            success: false,
            data: {},
            message: "You don't have any role permission to access this API",
        });
    }
    try {
        const listUploadedFiles = await FineTuneService.listUploadedFiles();
        return res.status(200).json({
            success: true,
            data: { listUploadedFiles },
            message: "Uploaded files found!",
        });
    } catch (err) {
        logger.error(err);
        next(err);
    }
};

export const listFineTuneOpenAI = async (_req: Request, res: Response, next: NextFunction) => {
    if (res.locals.role !== "admin") {
        return res.status(401).json({
            success: false,
            data: {},
            message: "You don't have any role permission to access this API",
        });
    }
    try {
        const listFinetunes = await FineTuneService.listFinetunes();
        return res.status(200).json({
            success: true,
            data: { listFinetunes },
            message: "List Fine tunes found!",
        });
    } catch (err) {
        logger.error(err);
        next(err);
    }
};

export const deleteFinetuneOpenAI = async (req: Request, res: Response, next: NextFunction) => {
    if (res.locals.role !== "admin") {
        return res.status(401).json({
            success: false,
            data: {},
            message: "You don't have any role permission to access this API",
        });
    }
    try {
        if (!req.query.id || typeof req.query.id === "undefined") {
            return res.status(422).json({
                success: false,
                data: {},
                message: "Fine tune id is required",
            });
        }
        const finetuneId = String(req.query.id);

        const deleteFinetune = await FineTuneService.deleteFinetune(finetuneId);
        return res.status(200).json({
            success: true,
            data: { deleteFinetune },
            message: "Fine tune has been deleted",
        });
    } catch (err) {
        logger.error(err);
        next(err);
    }
};

export const reformatJson = async (_req: Request, res: Response) => {
    if (res.locals.role !== "admin") {
        return res.status(401).json({
            success: false,
            data: {},
            message: "You don't have any role permission to access this API",
        });
    }
    const data = await FineTuneService.reformatJson();
    return res.status(200).json({
        success: true,
        data,
        message: "success",
    });
};

export const getDetailFinetune = async (req: Request, res: Response, next: NextFunction) => {
    if (res.locals.role !== "admin") {
        return res.status(401).json({
            success: false,
            data: {},
            message: "You don't have any role permission to access this API",
        });
    }
    try {
        if (!req.query.id || typeof req.query.id === "undefined") {
            return res.status(422).json({
                success: false,
                data: {},
                message: "Fine tune id is required",
            });
        }
        const finetuneId = String(req.query.id);
        const getDetailFinetune = await FineTuneService.getDetailFinetune(finetuneId);
        return res.status(200).json({
            success: true,
            data: { getDetailFinetune },
            message: "List Fine tunes found!",
        });
    } catch (err) {
        logger.error(err);
        next(err);
    }
};
