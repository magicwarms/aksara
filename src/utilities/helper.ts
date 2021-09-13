export const normalizeKey = (keyString: string): string => {
    return keyString.toLowerCase().replace(/ /g, "_");
};
