/**
 * Data Model Interfaces
 */
import { ValidationError } from "class-validator";
import isEmpty from "lodash/isEmpty";
import { UpdateResult } from "typeorm";

import validation from "../../config/validation";

import { Tone } from "./entity/Tone";
import * as ToneRepository from "./tone.repository";
import { normalizeKey } from "../../utilities/helper";

/**
 * Service Methods
 */
export const getAllTone = async (isActive: boolean, category: string): Promise<Tone[]> => {
    let getAllTone = await ToneRepository.getAllTone(isActive, category);
    if (getAllTone.length < 0) getAllTone = [];
    return getAllTone;
};

export const storeOrUpdateTone = async (toneData: Tone): Promise<Tone | ValidationError[]> => {
    const tone = new Tone();
    tone.id = isEmpty(toneData.id) ? undefined : toneData.id;
    tone.key = { id: normalizeKey(toneData.name.id), us: normalizeKey(toneData.name.us) };
    tone.name = toneData.name;
    tone.categories = toneData.categories;
    tone.isActive = toneData.isActive;

    const validateData = await validation(tone);
    if (validateData.length > 0) return validateData;

    const storeOrUpdateTone = await ToneRepository.storeOrUpdateTone(tone);

    return storeOrUpdateTone;
};

export const deleteTone = async (id: string): Promise<UpdateResult> => {
    return await ToneRepository.deleteTone(id);
};
