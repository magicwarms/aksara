import { validate } from "class-validator";

const validating = async (entity: any) => {
    const errors = await validate(entity, {
        skipMissingProperties: true,
        forbidUnknownValues: true,
        validationError: { target: false },
    });
    if (errors.length > 0) throw errors;
    return;
};

export default validating;
