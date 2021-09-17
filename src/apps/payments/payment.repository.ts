import { getConnection, getRepository, UpdateResult } from "typeorm";
import { Payment } from "./entity/Payment";
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

export const storePayment = async (paymentData: Payment): Promise<Payment> => {
    const storePayment = await getConnection().transaction(async (transactionalEntityManager) => {
        return await transactionalEntityManager.getRepository(Payment).save(paymentData);
    });
    return storePayment;
};

export const updateStatusPayment = async (paymentUpdate: {
    referenceDuitKuId: string;
    status: string;
    statusMessage: string;
}): Promise<UpdateResult> => {
    return await getRepository(Payment).update(
        { referenceDuitKuId: paymentUpdate.referenceDuitKuId },
        { status: paymentUpdate.status, statusMessage: paymentUpdate.statusMessage }
    );
};
