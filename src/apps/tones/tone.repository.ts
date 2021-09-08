import { getRepository, UpdateResult } from "typeorm";
import { Tone } from "./entity/Tone";
/**
 * Repository Methods
 */

export const getAllTone = async (isActive: boolean | null) => {
    return await getRepository(Tone).find({
        where: { isActive },
    });
};

export const storeOrUpdateTone = async (data: Tone) => {
    return await getRepository(Tone).save(data);
};

export const deleteTone = async (id: string): Promise<UpdateResult> => {
    return await getRepository(Tone).softDelete(id);
};
