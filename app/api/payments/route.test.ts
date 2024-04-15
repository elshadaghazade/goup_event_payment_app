import { testApiHandler } from "next-test-api-route-handler";
import * as appHandler from "./route"; // Adjust the import path as needed
import { prisma } from "@/prisma/prisma";
import { participant_role_enum } from "@prisma/client";
import { createPaymesPayment } from "@/prisma/client/client_paymes";

async function setupTestData() {
    return await prisma.$transaction(async tx => {
        const event = await tx.events.create({
            data: {
                name: 'Test Event',
                description: 'This is a test event',
                location: 'Test Location',
                start_date: new Date(),
                end_date: new Date(new Date().setDate(new Date().getDate() + 1)),
                created_at: new Date()
            },
            select: { id: true }
        });

        const packagePrice = await tx.packages.create({
            data: {
                event_id: event.id,
                type: participant_role_enum.professional,
                price: 100.00,
                description: 'Test Package',
                created_at: new Date()
            },
            select: { id: true }
        });

        const participant = await tx.participants.create({
            data: {
                role: participant_role_enum.professional,
                name: "John Doe",
                email: "john.doe@example.com",
                doc_no: "1234567890",
                event_id: event.id,
                created_at: new Date()
            },
            select: { id: true }
        });

        return { event, packagePrice, participant };
    });
}

async function cleanupTestData() {
    await prisma.$transaction(async tx => {
        await tx.payments.deleteMany();
        await tx.participants.deleteMany();
        await tx.packages.deleteMany();
        await tx.events.deleteMany();
    });
}

it("should successfully process a payment and return 201", async () => {

    await testApiHandler({
        appHandler,
        test: async ({ fetch }) => {
            const { event, packagePrice, participant } = await setupTestData();

            const response = await fetch({
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    participant_id: participant.id,
                    event_id: event.id,
                    package_id: packagePrice.id,
                    coupon_code: null // Optional, provide if testing with coupon
                })
            });

            const json = await response.json();
            await cleanupTestData();

            expect(response.status).toBe(201);
            expect(json.data.amount).toBe("100");
            expect(json.data.status).toBe("PAYMENT_AWAITING");
            expect(json.data.type).toBe('redirect');
        }
    });
});
