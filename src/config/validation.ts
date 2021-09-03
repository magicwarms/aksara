import { validate, ValidationError } from "class-validator";

const validating = async (entity: any): Promise<[] | ValidationError[]> => {
    const errors = await validate(entity, {
        skipMissingProperties: true,
        forbidUnknownValues: true,
        validationError: { target: false },
        stopAtFirstError: true,
    });
    if (errors.length > 0) {
        return errors;
    }
    return [];
};

export default validating;
