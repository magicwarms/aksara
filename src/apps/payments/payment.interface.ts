import { StatusMessage } from './payment.enum';

export interface queryCheckTrxPayment {
    transactionCode: string;
}

export interface queryGetAllPaymentMethod {
    amount: number;
}

export interface queryGetAllPaymentHistory {
    status?: StatusMessage;
}

export interface itemDetails {
    name: string;
    quantity: number;
    price: number;
}

interface customerDetails {
    firstName: string;
    lastName: string;
    email: string;
}

export interface transactionData {
    merchantCode: string | undefined;
    paymentAmount: number;
    merchantOrderId: string;
    productDetails: string;
    email: string;
    paymentMethod: string;
    customerVaName: string;
    itemDetails: itemDetails[];
    customerDetail: customerDetails;
    returnUrl: string | undefined;
    callbackUrl: string | undefined;
    signature: string;
    expiryPeriod: number;
    shopee?: string;
}

export interface responsePayment {
    merchantCode: string;
    reference: string;
    paymentUrl: string;
    statusCode: string;
    statusMessage: string;
    amount: string;
    vaNumber: string;
}

export interface paymentMethod {
    paymentFee: paymentFee[];
}

interface paymentFee {
    paymentMethod: string;
    paymentName: string;
    paymentImage: string;
    totalFee: number;
}

export interface storePaymentMethodData {
    paymentName: string;
    paymentMethod: string;
}

export interface responsePaymentStatus {
    merchantOrderId: string;
    reference: string;
    amount: string;
    fee: string;
    statusCode: string;
    statusMessage: string;
}
