import { CreatePaymentParamsType } from "@/app/interfaces/Payment";
import { createHttpErrorResponse, createHttpResponse } from "@/app/responses";
import { createPayment } from "@/prisma/client/client_payment";
import { NextRequest } from "next/server";

/**
 * @swagger
 * /api/payments:
 *   post:
 *     summary: Create a payment record and process payment via external gateway.
 *     description: >
 *       This endpoint initiates a payment process for an event participant. It accepts participant ID, event ID, 
 *       package ID, and an optional coupon code. It first validates the existence of the event, participant, 
 *       and package. If a valid coupon is provided, it applies a discount to the total price. The final payment 
 *       amount is then processed through an external payment gateway (Paymes). It returns the payment details 
 *       including a transaction URL provided by the gateway.
 *     operationId: createPayment
 *     tags:
 *       - Payments
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - participant_id
 *               - event_id
 *               - package_id
 *             properties:
 *               participant_id:
 *                 type: integer
 *                 description: Unique identifier of the participant.
 *               event_id:
 *                 type: integer
 *                 description: Unique identifier of the event for which payment is being made.
 *               package_id:
 *                 type: integer
 *                 description: Unique identifier of the package selected by the participant.
 *               coupon_code:
 *                 type: string
 *                 description: Optional coupon code for discount application.
 *     responses:
 *       201:
 *         description: Payment successfully processed and recorded.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: Unique identifier of the payment record.
 *                 amount:
 *                   type: number
 *                   description: Final amount paid after any discounts.
 *                 status:
 *                   type: string
 *                   description: Status of the payment from the payment gateway.
 *                 transaction_id:
 *                   type: string
 *                   description: Transaction ID provided by the payment gateway.
 *                 url:
 *                   type: string
 *                   format: uri
 *                   description: URL to complete the payment if further action is required.
 *       400:
 *         description: Bad Request - Invalid input parameters.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Not Found - One of the resources (event, participant, or package) was not found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * components:
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: A message detailing the error encountered.
 */

export const POST = async (req: NextRequest) => {
    try {
        const params: CreatePaymentParamsType = await req.json();
        const result = await createPayment({
            participant_id: params.participant_id,
            event_id: params.event_id,
            package_id: params.package_id,
            coupon_code: params.coupon_code
        });

        return createHttpResponse(result, {
            statusCode: 201
        })
    } catch (err) {
        return createHttpErrorResponse(err);
    }
}