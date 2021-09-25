import csvtojson from "csvtojson";
import fs from "fs";
import FormData from "form-data";
import axios from "axios";

import { deleteFile } from "../../utilities/file";

const API_LINK_OPENAI = "https://api.openai.com/v1/files";

export const listUploadedFiles = async () => {
    const uploadedFiles = await axios({
        method: "get",
        url: API_LINK_OPENAI,
        headers: {
            Authorization: `Bearer ${process.env.OPENAI_KEY}`,
        },
    });
    return uploadedFiles.data;
};

const uploadFileToOpenAI = async (fileName: string, purpose: string) => {
    const formData = new FormData();
    formData.append("file", fs.createReadStream(process.cwd() + `/temp/${fileName}`));
    formData.append("purpose", purpose);
    // start upload file to openAI server
    const uploadFile = await axios({
        url: API_LINK_OPENAI,
        method: "post",
        headers: {
            Authorization: `Bearer ${process.env.OPENAI_KEY}`,
            ...formData.getHeaders(),
            "Content-Type": "multipart/form-data",
        },
        data: formData,
    });

    return uploadFile;
};

const createFineTuneToOpenAI = async (
    fileId: string,
    model: string,
    learning_rate_multiplier: number,
    prompt_loss_weight: number
) => {
    const createFineTune = await axios({
        url: "https://api.openai.com/v1/fine-tunes",
        method: "post",
        headers: {
            Authorization: `Bearer ${process.env.OPENAI_KEY}`,
            "Content-Type": "application/json",
        },
        data: {
            training_file: fileId,
            model,
            learning_rate_multiplier,
            prompt_loss_weight,
        },
    });

    return createFineTune;
};

export const listFinetunes = async () => {
    const ListFinetunes = await axios({
        method: "get",
        url: "https://api.openai.com/v1/fine-tunes",
        headers: {
            Authorization: `Bearer ${process.env.OPENAI_KEY}`,
        },
    });
    return ListFinetunes.data;
};

export const deleteFinetune = async (finetuneId: string) => {
    const deleteFinetune = await axios({
        method: "delete",
        url: `https://api.openai.com/v1/models/${finetuneId}`,
        headers: {
            Authorization: `Bearer ${process.env.OPENAI_KEY}`,
        },
    });
    return deleteFinetune.data;
};

export const getDetailFinetune = async (finetuneId: string) => {
    const detailFinetune = await axios({
        method: "get",
        url: `https://api.openai.com/v1/fine-tunes/${finetuneId}`,
        headers: {
            Authorization: `Bearer ${process.env.OPENAI_KEY}`,
        },
    });
    return detailFinetune.data;
};

/**
 * Service Methods
 */
export const convertCsvToJsonLine = async (data: any): Promise<any> => {
    try {
        let jsonLineFilename: string = data.file.filename;
        if (data.body.isCSV) {
            let csvFilePath: string = data.file.path;
            const convertStart = await csvtojson({ ignoreColumns: /(sentiment)/ }).fromFile(csvFilePath);
            if (!convertStart) return false;
            const jsonData = convertStart.map((item) => {
                return {
                    prompt: `${item.prompt}\n\n###\n\n`,
                    completion: ` ${item.completion}`,
                };
            });
            jsonLineFilename = data.file.filename.replace(".csv", ".jsonl");
            const jsonLinePath = process.cwd() + `/temp/${jsonLineFilename}`;

            for (const itemObject of jsonData) {
                await fs.promises.appendFile(jsonLinePath, JSON.stringify(itemObject) + "\n");
            }
        }
        const startUploadFiles = await uploadFileToOpenAI(jsonLineFilename, "fine-tune");
        if (!startUploadFiles) return false;

        deleteFile("temp/" + jsonLineFilename);

        const startCreateFineTune = await createFineTuneToOpenAI(startUploadFiles.data.id, "babbage", 0.4, 1);
        if (!startCreateFineTune) return false;

        return true;
    } catch (err) {
    } finally {
        deleteFile("temp/" + data.file.filename);
    }
};

export const reformatJson = async () => {
    const jsonFile = process.cwd() + `/temp/idiom.json`;
    let readFile: any = fs.readFileSync(jsonFile, "utf-8");
    readFile = JSON.parse(readFile);
    let jsonData: Array<{ prompt: string; completion: string }> = [];
    for (const item of readFile.entries) {
        jsonData.push({
            prompt: `${item.fields.title["en-US"]}\n\n###\n\n`,
            completion: ` ${item.fields.meaning["en-US"]}`,
        });
    }
    const jsonLinePath = process.cwd() + `/temp/idiom.jsonl`;
    for (const itemObject of jsonData) {
        await fs.promises.appendFile(jsonLinePath, JSON.stringify(itemObject) + "\n");
    }

    return true;
};
