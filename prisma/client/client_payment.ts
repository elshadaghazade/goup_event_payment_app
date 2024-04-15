import { ClientError } from "@/app/interfaces/ClientError";
import { CreatePaymentParamsType } from "@/app/interfaces/Payment";
import { prisma } from "@/prisma/prisma";
import { createPaymesPayment } from "./client_paymes";
import { paymentSelect } from "./selects";

export const createPayment = async (params: CreatePaymentParamsType) => {
    if (isNaN(Number(params.event_id))
        || isNaN(Number(params.package_id))
        || isNaN(Number(params.participant_id))
    ) {
        throw new ClientError("BAD_REQUEST", 400);
    }

    return await prisma.$transaction(async tx => {
        const event = await tx.events.findUnique({
            where: {
                id: params.event_id
            }
        });

        if (!event) {
            throw new ClientError("EVENT_NOT_FOUND", 404);
        }

        const participant = await tx.participants.findUnique({
            where: {
                id: params.participant_id
            }
        });

        if (!participant) {
            throw new ClientError("PARTICIPANT_NOT_FOUND", 404);
        }

        const packagePrice = await tx.packages.findUnique({
            where: {
                id: params.package_id
            }
        });

        if (!packagePrice) {
            throw new ClientError("PACKAGE_NOT_FOUND", 404);
        }

        let coupon;
        if (params.coupon_code?.trim()) {
            coupon = await tx.coupons.findFirst({
                where: {
                    code: params.coupon_code
                }
            });
        }

        let price = Number(packagePrice.price);
        let discount = coupon?.discount_percent || 0;
        const finalAmount = price - price * (discount / 100);

        const payment = await tx.payments.create({
            data: {
                participant_id: participant.id,
                event_id: event.id,
                package_id: packagePrice.id,
                amount: finalAmount,
                coupon_id: coupon?.id,
                created_at: new Date()
            }
        });

        const {url, type, orderId, status} = await createPaymesPayment({
            productPrice: finalAmount,
            productName: `event name: ${event.name}; id: ${event.id}`,
            firstName: participant.name,
            lastName: participant.name,
            email: participant.email,
            paymentId: payment.id
        });

        await tx.payments.update({
            where: {
                id: payment.id
            },
            data: {
                url,
                type,
                transaction_id: orderId,
                status
            }
        });

        return await tx.payments.findUnique({
            where: {
                id: payment.id
            },
            ...paymentSelect
        });
    });
}