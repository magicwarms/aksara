import { getRepository, UpdateResult } from "typeorm";
import { FromTo } from "./entity/FromTo";
/**
 * Repository Methods
 */

export const getAllFromTo = async (isActive: boolean, categoryId: string) => {
    return await getRepository(FromTo)
        .createQueryBuilder("fromto")
        .select(["fromto.id", "fromto.key", "fromto.name", "fromto.categories"])
        .where("fromto.categories ::jsonb @> :categories", {
            categories: JSON.stringify([
                {
                    id: categoryId,
                },
            ]),
        })
        .andWhere("fromto.isActive = :isActive", { isActive })
        .getMany();
};

export const storeOrUpdateFromTo = async (data: FromTo) => {
    return await getRepository(FromTo).save(data);
};

export const deleteFromTo = async (id: string): Promise<UpdateResult> => {
    return await getRepository(FromTo).softDelete(id);
};
