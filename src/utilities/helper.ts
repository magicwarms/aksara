import { customAlphabet } from "nanoid";
import { StatusCode, StatusMessage } from "../apps/payments/payment.enum";
const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", 6);

export const normalizeKey = (keyString: string): string => {
    return keyString.toLowerCase().replace(/ /g, "_");
};

export const setNanoId = (): string => nanoid();

export const setStatusMessageCallback = (statusCode: string): StatusMessage | string => {
    let statusMsg;
    if (statusCode === "00") {
        statusMsg = StatusMessage.SUCCESS;
    } else if (statusCode === "01") {
        statusMsg = StatusMessage.FAILED;
    } else {
        return "ERROR";
    }
    return statusMsg;
};

export const checkStatusCode = (status: string): StatusCode | string => {
    let statusCode;
    if (status === "00") {
        statusCode = StatusCode.SUCCESS;
    } else if (status === "01") {
        statusCode = StatusCode.FAILED;
    } else {
        return "ERROR";
    }
    return statusCode;
};
