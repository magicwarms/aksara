/**
 * Data Model Interfaces
 */
import { ValidationError } from "class-validator";
import isEmpty from "lodash/isEmpty";
import { UpdateResult } from "typeorm";

import validation from "../../config/validation";
import { normalizeKey } from "../../utilities/helper";

import { FromTo } from "./entity/FromTo";
import * as FromToRepository from "./fromto.repository";

/**
 * Service Methods
 */
export const getAllFromTo = async (isActive: boolean | null): Promise<FromTo[]> => {
    let getAllFromTo = await FromToRepository.getAllFromTo(isActive);
    if (getAllFromTo.length < 0) getAllFromTo = [];
    return getAllFromTo;
};

export const storeOrUpdateFromTo = async (fromToData: FromTo): Promise<FromTo | ValidationError[]> => {
    const fromto = new FromTo();
    fromto.id = isEmpty(fromToData.id) ? undefined : fromToData.id;
    fromto.key = { id: normalizeKey(fromToData.name.id), us: normalizeKey(fromToData.name.us) };
    fromto.name = fromToData.name;
    fromto.categories = fromToData.categories;
    fromto.isActive = fromToData.isActive;

    const validateData = await validation(fromto);
    if (validateData.length > 0) return validateData;

    const updateUserProfile = await FromToRepository.storeOrUpdateFromTo(fromto);

    return updateUserProfile;
};

export const deleteFromTo = async (id: string): Promise<UpdateResult> => {
    return await FromToRepository.deleteFromTo(id);
};
