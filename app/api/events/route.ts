import { searchEvents } from "@/prisma/client/client_event";
import { NextRequest } from "next/server";
import { createHttpErrorResponse, createHttpResponse } from "@/app/responses";

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Retrieves a list of all current and future events.
 *     description: Returns an array of events that are currently ongoing or scheduled to occur in the future. This endpoint is ideal for fetching events to display in a user interface where participants can browse and select events to attend.
 *     operationId: getEvents
 *     tags:
 *       - Events
 *     responses:
 *       200:
 *         description: A list of events.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - description
 *         - location
 *         - start_date
 *         - end_date
 *         - price
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique identifier of the event.
 *         name:
 *           type: string
 *           description: The name of the event.
 *         description:
 *           type: string
 *           description: A detailed description of the event.
 *         location:
 *           type: string
 *           description: The physical or virtual location of the event.
 *         start_date:
 *           type: string
 *           format: date-time
 *           description: The start date and time of the event.
 *         end_date:
 *           type: string
 *           format: date-time
 *           description: The end date and time of the event.
 *         price:
 *           type: number
 *           format: float
 *           description: The price of attending the event.
 *     Error:
 *       type: object
 *       required:
 *         - message
 *       properties:
 *         message:
 *           type: string
 *           description: A message describing the error.
 */

export const GET = async (req: NextRequest) => {
    try {
        const events = await searchEvents();
        return createHttpResponse(events);
    } catch (err: any) {
        return createHttpErrorResponse(err);
    }
}
