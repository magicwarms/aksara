import { NextFunction, Request, Response } from "express";
import fs from "fs";

import logger from "../config/logger";

import * as FineTuneService from "./finetune.service";

export const convert = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.file?.mimetype !== "text/csv") {
            fs.unlink("temp/" + req.file?.filename, (err) => {
                if (err) {
                    logger.error(err);
                    next(err);
                }
            });
            return res.status(422).json({
                success: false,
                data: {},
                message: "Please upload csv file only",
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
