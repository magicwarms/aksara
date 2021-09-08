import { getRepository, UpdateResult } from "typeorm";
import { FromTo } from "./entity/FromTo";
/**
 * Repository Methods
 */

export const getAllFromTo = async (isActive: boolean | null) => {
    const whereQuery = isActive ? { where: { isActive } } : undefined;
    return await getRepository(FromTo).find(whereQuery);
};

export const storeOrUpdateFromTo = async (data: FromTo) => {
    return await getRepository(FromTo).save(data);
};

export const deleteFromTo = async (id: string): Promise<UpdateResult> => {
    return await getRepository(FromTo).softDelete(id);
};
