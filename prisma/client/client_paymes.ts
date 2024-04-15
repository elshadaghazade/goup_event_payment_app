import { CreatePaymesPaymentParamsType, CreatePaymesPaymentReturnType } from "@/app/interfaces/Payment";


export const createPaymesPayment = async (params: CreatePaymesPaymentParamsType): Promise<CreatePaymesPaymentReturnType> => {
    const formData = new FormData();
    formData.append('secret', process.env.PAYMES_SECRET!);
    formData.append('productPrice', params.productPrice.toString());
    formData.append('productName', params.productName);
    formData.append('firstName', params.firstName);
    formData.append('lastName', params.lastName);
    formData.append('email', params.email);
    formData.append('paymentId', params.paymentId.toString());

    const response = await fetch('https://azweb.paym.es/api/authorize', {
            method: 'POST',
            body: formData
    });

    return await response.json();
}