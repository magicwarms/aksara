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
    } else if (statusCode === "02") {
        statusMsg = StatusMessage.PROCESS;
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
    } else if (statusCode === "02") {
        statusCode = StatusMessage.PROCESS;
    } else {
        return "ERROR";
    }
    return statusCode;
};

export const currentFormattedDateTime = () => {
    const date_ob = new Date();
    // adjust 0 before single digit date
    const date = ("0" + date_ob.getDate()).slice(-2);
    // current month
    const month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    // current year
    const year = date_ob.getFullYear();
    // current hours
    const hours = ("0" + (date_ob.getHours() + 1)).slice(-2);
    // current minutes
    const minutes = ("0" + (date_ob.getMinutes() + 1)).slice(-2);
    // current seconds
    const seconds = ("0" + (date_ob.getSeconds() + 1)).slice(-2);
    // prints date & time in YYYY-MM-DD HH:MM:SS format
    return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
};
