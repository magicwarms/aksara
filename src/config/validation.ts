/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { validate, ValidationError } from 'class-validator';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validating = async (entity: any): Promise<[] | ValidationError[]> => {
    const errors = await validate(entity, {
        skipMissingProperties: true,
        forbidUnknownValues: true,
        validationError: { target: false },
        stopAtFirstError: true
    });
    if (errors.length > 0) {
        return errors;
    }
    return [];
};

export default validating;
