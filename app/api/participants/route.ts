import { createParticipant } from "@/prisma/client/client_participant";
import { NextRequest } from "next/server";
import { createHttpErrorResponse, createHttpResponse } from "@/app/responses";
import { CreateParticipantParamsType } from "@/app/interfaces/Participant";

/**
 * @swagger
 * /api/participants:
 *   post:
 *     summary: Registers a new participant or retrieves an existing one based on email address.
 *     description: >
 *       This endpoint registers a new participant with their document number, email, name, and role.
 *       If a participant with the given email already exists, it returns the existing participant data.
 *       Validation checks are performed on the email format, required fields, and role to ensure they meet
 *       the specifications. If any validation fails, a "BAD_REQUEST" error is thrown.
 *     operationId: createOrRetrieveParticipant
 *     tags:
 *       - Participants
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - doc_no
 *               - email
 *               - name
 *               - role
 *             properties:
 *               doc_no:
 *                 type: string
 *                 description: Document number of the participant.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email address of the participant, must be unique and in a valid email format.
 *               name:
 *                 type: string
 *                 description: Full name of the participant.
 *               role:
 *                 type: string
 *                 enum: [professional, student]
 *                 description: Role of the participant, restricted to either 'professional' or 'student'.
 *     responses:
 *       201:
 *         description: Participant created or retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: Unique identifier of the participant.
 *                 doc_no:
 *                   type: string
 *                   description: Document number of the participant.
 *                 email:
 *                   type: string
 *                   description: Email address of the participant.
 *                 name:
 *                   type: string
 *                   description: Full name of the participant.
 *                 role:
 *                   type: string
 *                   description: Role of the participant.
 *       400:
 *         description: Bad Request - Incorrect or insufficient data provided.
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
 *       required:
 *         - message
 *       properties:
 *         message:
 *           type: string
 *           description: A message describing the error.
 */

export const POST = async (req: NextRequest) => {
    try {
        const params: CreateParticipantParamsType = await req.json();
        const events = await createParticipant(params);
        return createHttpResponse(events, {
            statusCode: 201
        });
    } catch (err: any) {
        return createHttpErrorResponse(err);
    }
}
