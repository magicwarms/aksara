import csvtojson from 'csvtojson';
import fs from 'fs';
import FormData from 'form-data';
import axios from 'axios';

import { deleteFile } from '../../utilities/file';

const API_LINK_OPENAI = 'https://api.openai.com/v1/files';

export const listUploadedFiles = async (): Promise<unknown> => {
    const uploadedFiles = await axios({
        method: 'get',
        url: API_LINK_OPENAI,
        headers: {
            Authorization: `Bearer ${process.env.OPENAI_KEY}`
        }
    });
    return uploadedFiles.data;
};

const uploadFileToOpenAI = async (fileName: string, purpose: string): Promise<{ data: { id: string } }> => {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(process.cwd() + `/temp/${fileName}`));
    formData.append('purpose', purpose);
    // start upload file to openAI server
    const uploadFile = await axios({
        url: API_LINK_OPENAI,
        method: 'post',
        headers: {
            Authorization: `Bearer ${process.env.OPENAI_KEY}`,
            ...formData.getHeaders(),
            'Content-Type': 'multipart/form-data'
        },
        data: formData
    });

    return uploadFile;
};

const createFineTuneToOpenAI = async (
    fileId: string,
    model: string,
    learning_rate_multiplier: number,
    prompt_loss_weight: number
): Promise<unknown> => {
    const createFineTune = await axios({
        url: 'https://api.openai.com/v1/fine-tunes',
        method: 'post',
        headers: {
            Authorization: `Bearer ${process.env.OPENAI_KEY}`,
            'Content-Type': 'application/json'
        },
        data: {
            training_file: fileId,
            model,
            learning_rate_multiplier,
            prompt_loss_weight
        }
    });

    return createFineTune;
};

export const listFinetunes = async (): Promise<unknown> => {
    const ListFinetunes = await axios({
        method: 'get',
        url: 'https://api.openai.com/v1/fine-tunes',
        headers: {
            Authorization: `Bearer ${process.env.OPENAI_KEY}`
        }
    });
    return ListFinetunes.data;
};

export const deleteFinetune = async (finetuneId: string): Promise<unknown> => {
    const deleteFinetune = await axios({
        method: 'delete',
        url: `https://api.openai.com/v1/models/${finetuneId}`,
        headers: {
            Authorization: `Bearer ${process.env.OPENAI_KEY}`
        }
    });
    return deleteFinetune.data;
};

export const getDetailFinetune = async (finetuneId: string): Promise<unknown> => {
    const detailFinetune = await axios({
        method: 'get',
        url: `https://api.openai.com/v1/fine-tunes/${finetuneId}`,
        headers: {
            Authorization: `Bearer ${process.env.OPENAI_KEY}`
        }
    });
    return detailFinetune.data;
};

/**
 * Service Methods
 */
export const convertCsvToJsonLine = async (data: {
    file: { filename: string; path: string };
    body: { isCSV: boolean };
}): Promise<boolean | undefined> => {
    let jsonLineFilename: string = data.file.filename;
    if (data.body.isCSV) {
        const csvFilePath: string = data.file.path;
        const convertStart = await csvtojson({ ignoreColumns: /(sentiment)/ }).fromFile(csvFilePath);
        if (!convertStart) return false;
        const jsonData = convertStart.map((item) => {
            return {
                prompt: `${item.prompt}\n\n###\n\n`,
                completion: ` ${item.completion}`
            };
        });
        jsonLineFilename = data.file.filename.replace('.csv', '.jsonl');
        const jsonLinePath = process.cwd() + `/temp/${jsonLineFilename}`;

        for (const itemObject of jsonData) {
            await fs.promises.appendFile(jsonLinePath, JSON.stringify(itemObject) + '\n');
        }
    }
    Promise.all([deleteFile('temp/' + jsonLineFilename), deleteFile('temp/' + data.file.filename)]);
    const startUploadFiles: { data: { id: string } } = await uploadFileToOpenAI(jsonLineFilename, 'fine-tune');
    if (!startUploadFiles) return false;

    const startCreateFineTune = await createFineTuneToOpenAI(startUploadFiles.data.id, 'babbage', 0.4, 1);
    if (!startCreateFineTune) return false;

    return true;
};

export const reformatJson = async (): Promise<boolean> => {
    const jsonFile = process.cwd() + `/temp/idiom.json`;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let readFile: any = fs.readFileSync(jsonFile, 'utf-8');
    readFile = JSON.parse(readFile);
    const jsonData: Array<{ prompt: string; completion: string }> = [];
    for (const item of readFile.entries) {
        jsonData.push({
            prompt: `${item.fields.title['en-US']}\n\n###\n\n`,
            completion: ` ${item.fields.meaning['en-US']}`
        });
    }
    const jsonLinePath = process.cwd() + `/temp/idiom.jsonl`;
    for (const itemObject of jsonData) {
        await fs.promises.appendFile(jsonLinePath, JSON.stringify(itemObject) + '\n');
    }

    return true;
};
