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

it("should successfully create a participant and return 201", async () => {
  

  await testApiHandler({
    appHandler,
    test: async ({ fetch }) => {

      const {event, price_package} = await createEventAndPackage();
      
      const response = await fetch({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          doc_no: "123456",
          email: "test@example.com",
          event_id: event.id,
          name: "John Doe",
          package_id: price_package.id,
          role: participant_role_enum.professional
        })
      });

      const json = await response.json();

      await removeEventAndPackage();

      expect(response.status).toBe(201);
      expect(json.data.name).toBe('John Doe');
    }
  });
});
