import { customAlphabet } from "nanoid";
import { StatusCode, StatusMessage } from "../apps/payments/payment.enum";
const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", 6);

export const normalizeKey = (keyString: string): string => {
    return keyString.toLowerCase().replace(/ /g, "_");
};

export const setNanoId = (): string => nanoid();

export const setStatusMessageRedirect = (statusCode: string): StatusMessage => {
    let statusMsg = StatusMessage.PENDING;
    if (statusCode === "00") {
        statusMsg = StatusMessage.SUCCESS;
    } else if (statusCode === "02") {
        statusMsg = StatusMessage.CANCEL;
    }
    return statusMsg;
};

export const checkStatusCode = (status: string): StatusCode | string => {
    let statusCode;
    if (status === "00") {
        statusCode = StatusCode.SUCCESS;
    } else if (status === "02") {
        statusCode = StatusCode.CANCEL;
    } else if (status === "01") {
        statusCode = StatusCode.PENDING;
    } else {
        return "ERROR";
    }
    return statusCode;
};
