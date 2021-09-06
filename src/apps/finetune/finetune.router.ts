/**
 * Required External Modules and Interfaces
 */
import express from "express";

import startUpload from "../../utilities/csvfile";
import * as FineTuneController from "./finetune.controller";
/**
 * Router Definition
 */
const finetuneRouter = express.Router();
/**
 * Controller Definitions
 */
finetuneRouter.post("/convert", startUpload("csvFile"), FineTuneController.convert);
finetuneRouter.get("/uploadedfiles", FineTuneController.listUploadedOpenAIFile);
finetuneRouter.get("/list", FineTuneController.listFineTuneOpenAI);
finetuneRouter.delete("/delete", FineTuneController.deleteFinetuneOpenAI);
finetuneRouter.get("/detail", FineTuneController.getDetailFinetune);

finetuneRouter.get("/reformat", FineTuneController.reformatJson);

export default finetuneRouter;
