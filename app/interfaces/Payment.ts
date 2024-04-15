export interface CreatePaymentParamsType {
    participant_id: number;
    event_id: number;
    package_id: number;
    coupon_code?: string | null;
}

export interface CreatePaymesPaymentParamsType {
    productPrice: number;
    productName: string;
    firstName: string;
    lastName: string;
    email: string;
    paymentId: number;
}

export interface CreatePaymesPaymentReturnType {
    orderId: string;
    paymentId: string;
    status: string;
    url: string;
    type: string;
    amount: string;
}