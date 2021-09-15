import { getRepository, UpdateResult } from "typeorm";
import { Tone } from "./entity/Tone";
/**
 * Repository Methods
 */

export const getAllTone = async (isActive: boolean, categoryId: string) => {
    return await getRepository(Tone)
        .createQueryBuilder("tone")
        .select()
        .where("tone.categories ::jsonb @> :categories", {
            categories: JSON.stringify([
                {
                    id: categoryId,
                },
            ]),
        })
        .andWhere("tone.isActive = :isActive", { isActive })
        .getMany();
};

export const storeOrUpdateTone = async (data: Tone) => {
    return await getRepository(Tone).save(data);
};

export const deleteTone = async (id: string): Promise<UpdateResult> => {
    return await getRepository(Tone).softDelete(id);
};
