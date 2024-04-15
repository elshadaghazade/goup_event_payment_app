import { testApiHandler } from "next-test-api-route-handler";
import * as appHandler from "./route"; // Assuming your event handler is in this file
import { prisma } from "@/prisma/prisma";
import { participant_role_enum } from "@prisma/client";

async function createEventAndPackage () {
  return await prisma.$transaction(async tx => {
    const start_date = new Date();
    const end_date = new Date();

    start_date.setDate(start_date.getDate() - 1);
    end_date.setDate(end_date.getDate() + 1);

    const event = await tx.events.create({
      data: {
        name: 'Test event',
        description: 'test description',
        location: 'test location',
        start_date,
        end_date,
        created_at: new Date()
      },
      select: {
        id: true
      }
    });

    const price_package = await tx.packages.create({
      data: {
        event_id: event.id,
        type: participant_role_enum.professional,
        price: 30,
        description: 'test description',
        created_at: new Date()
      }
    });

    return {event, price_package}
  });
}

async function removeEventAndPackage () {
  await prisma.$transaction(async tx => {
    await tx.packages.deleteMany();
    await tx.events.deleteMany();
  });
}

it("should return 200 and an array of events for valid request", async () => {
  await testApiHandler({
    appHandler,
    requestPatcher: async req => {
      
      const {event} = await createEventAndPackage();

      req.nextUrl.searchParams.set('event_id', event.id.toString());
    },
    test: async ({ fetch }) => {
      const response = await fetch({
        method: 'GET'
      });

      const json = await response.json();

      await removeEventAndPackage();

      expect(response.status).toBe(200);
      expect(json.error).toBe(null);
      expect(json.data).toBeInstanceOf(Array);
      expect(json.data.length).toBeGreaterThan(0);
      expect(json.data[0]?.description).toBe('test description');
    },
  });
});
