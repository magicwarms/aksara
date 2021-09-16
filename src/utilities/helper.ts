import { customAlphabet } from "nanoid";
const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", 6);

export const normalizeKey = (keyString: string): string => {
    return keyString.toLowerCase().replace(/ /g, "_");
};

export const setNanoId = (): string => nanoid();
