import { getConnection, getRepository, UpdateResult } from "typeorm";
import { Payment } from "./entity/Payment";
/**
 * Repository Methods
 */

export const storePayment = async (paymentData: Payment): Promise<Payment> => {
    const storePayment = await getConnection().transaction(async (transactionalEntityManager) => {
        return await transactionalEntityManager.getRepository(Payment).save(paymentData);
    });
    return storePayment;
};

export const updatePaymentStatus = async (paymentUpdate: {
    referenceDuitKuId: string;
    status: string;
    statusMessage: string;
}): Promise<UpdateResult> => {
    return await getRepository(Payment).update(
        { referenceDuitKuId: paymentUpdate.referenceDuitKuId },
        { status: paymentUpdate.status, statusMessage: paymentUpdate.statusMessage }
    );
};

export const getPaymentByReferenceId = async (reference: string) => {
    return await getRepository(Payment).findOne({
        where: { referenceDuitKuId: reference },
        select: ["id", "userId", "credits", "status", "statusMessage"],
    });
};
