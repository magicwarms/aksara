export default {
    merchantCode:
        process.env.NODE_ENV === "production"
            ? process.env.MERCHANT_CODE_DUITKU_PROD!
            : process.env.MERCHANT_CODE_DUITKU_DEV!,
    merchantKey:
        process.env.NODE_ENV === "production"
            ? process.env.MERCHANT_KEY_DUITKU_PROD!
            : process.env.MERCHANT_KEY_DUITKU_DEV!,
    returnUrl:
        process.env.NODE_ENV === "production"
            ? process.env.RETURN_URL_DUITKU_PROD!
            : process.env.RETURN_URL_DUITKU_DEV!,
    callbackUrl:
        process.env.NODE_ENV === "production"
            ? process.env.CALLBACK_URL_DUITKU_PROD!
            : process.env.CALLBACK_URL_DUITKU_DEV!,
    endpointRequestTransaction:
        process.env.NODE_ENV === "production"
            ? process.env.DUITKU_API_ENDPOINT_REQUEST_TRANSACTION_PROD!
            : process.env.DUITKU_API_ENDPOINT_REQUEST_TRANSACTION_DEV!,
    endpointCheckTransaction:
        process.env.NODE_ENV === "production"
            ? process.env.DUITKU_API_ENDPOINT_CHECK_TRANSACTION_PROD!
            : process.env.DUITKU_API_ENDPOINT_CHECK_TRANSACTION_DEV!,
    endpointGetPaymentMethodUrl:
        process.env.NODE_ENV === "production"
            ? process.env.DUITKU_API_ENDPOINT_GET_PAYMENTMETHOD_PROD!
            : process.env.DUITKU_API_ENDPOINT_GET_PAYMENTMETHOD_DEV!,
};
