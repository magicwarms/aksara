import { getRepository, UpdateResult } from "typeorm";
import { Theme } from "./entity/Theme";
/**
 * Repository Methods
 */

export const getAllTheme = async (isActive: boolean | null) => {
    const whereQuery = isActive ? { where: { isActive } } : undefined;
    return await getRepository(Theme).find(whereQuery);
};

export const storeOrUpdateTheme = async (data: Theme) => {
    return await getRepository(Theme).save(data);
};

export const deleteTheme = async (id: string): Promise<UpdateResult> => {
    return await getRepository(Theme).softDelete(id);
};
