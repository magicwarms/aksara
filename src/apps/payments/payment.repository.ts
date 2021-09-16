import { getRepository, UpdateResult } from "typeorm";
import { PaymentMethod } from "./entity/PaymentMethod";
/**
 * Repository Methods
 */

export const getAllPaymentMethod = async () => {
    return await getRepository(PaymentMethod).find({ where: { isActive: true } });
};

export const storeOrUpdatePaymentMethod = async (data: PaymentMethod) => {
    return await getRepository(PaymentMethod).save(data);
};

export const deletePaymentMethod = async (id: string): Promise<UpdateResult> => {
    return await getRepository(PaymentMethod).softDelete(id);
};
