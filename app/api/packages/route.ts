import { NextRequest } from "next/server";
import { createHttpErrorResponse, createHttpResponse } from "@/app/responses";
import { searchPackages } from "@/prisma/client/client_package";

/**
 * @swagger
 * /api/packages:
 *   get:
 *     summary: Retrieves packages associated with a specific event.
 *     description: >
 *       This endpoint allows fetching of all packages linked to a given event by its ID.
 *       The event ID must be provided as a query parameter. This is useful for clients
 *       that need to display package options for a specific event.
 *     operationId: getEventPackages
 *     tags:
 *       - Packages
 *     parameters:
 *       - in: query
 *         name: event_id
 *         required: true
 *         description: The ID of the event to fetch packages for.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: An array of packages linked to the specified event.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Package'
 *       400:
 *         description: Bad Request - Invalid or missing event ID.
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
 *     Package:
 *       type: object
 *       required:
 *         - id
 *         - event_id
 *         - type
 *         - price
 *         - description
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique identifier for the package.
 *         event_id:
 *           type: integer
 *           description: The identifier of the event this package is associated with.
 *         type:
 *           type: string
 *           description: Type of package, e.g., professional, student.
 *         price:
 *           type: decimal
 *           format: float
 *           description: The price of the package.
 *         description:
 *           type: string
 *           description: A brief description of what the package includes.
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: A message detailing the error encountered.
 */

export const GET = async (req: NextRequest) => {
    try {
        const eventId: number = Number(req.nextUrl.searchParams.get('event_id'));
        const events = await searchPackages(eventId);
        return createHttpResponse(events);
    } catch (err: any) {
        return createHttpErrorResponse(err);
    }
}
