/**
 * Data Model Interfaces
 */
import { ValidationError } from "class-validator";
import isEmpty from "lodash/isEmpty";
import { UpdateResult } from "typeorm";

import validation from "../../config/validation";
import { normalizeKey } from "../../utilities/helper";

import { Theme } from "./entity/Theme";
import * as ThemeRepository from "./theme.repository";

/**
 * Service Methods
 */
export const getAllTheme = async (isActive: boolean | null): Promise<Theme[]> => {
    let getAllTheme = await ThemeRepository.getAllTheme(isActive);
    if (getAllTheme.length < 0) getAllTheme = [];
    return getAllTheme;
};

export const storeOrUpdateTheme = async (themeData: Theme): Promise<Theme | ValidationError[]> => {
    const theme = new Theme();
    theme.id = isEmpty(themeData.id) ? undefined : themeData.id;
    theme.key = { id: normalizeKey(themeData.name.id), us: normalizeKey(themeData.name.us) };
    theme.name = themeData.name;
    theme.isActive = themeData.isActive;

    const validateData = await validation(theme);
    if (validateData.length > 0) return validateData;

    const storeOrUpdateTheme = await ThemeRepository.storeOrUpdateTheme(theme);

    return storeOrUpdateTheme;
};

export const deleteTheme = async (id: string): Promise<UpdateResult> => {
    return await ThemeRepository.deleteTheme(id);
};
