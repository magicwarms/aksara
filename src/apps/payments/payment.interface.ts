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
