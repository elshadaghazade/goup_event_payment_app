import { testApiHandler } from "next-test-api-route-handler";
import * as appHandler from "./route"; // Assuming your event handler is in this file
import { prisma } from "@/prisma/prisma";

it("should return 200 and an array of events for valid request", async () => {
  await testApiHandler({
    appHandler, // Using the exported GET function directly
    test: async ({ fetch }) => {
      // Setup: Creating a mock event in the database
      await prisma.events.create({
        data: {
          name: 'Tech Conference 2024',
          description: 'A comprehensive tech conference',
          location: 'Virtual',
          start_date: new Date(),
          end_date: new Date(new Date().setDate(new Date().getDate() + 1)),
          created_at: new Date()
        },
        select: {
          id: true,
        }
      });

      const response = await fetch({
        method: 'GET'
      });

      await prisma.packages.deleteMany();
      await prisma.events.deleteMany();

      const json = await response.json();

      expect(response.status).toBe(200);
      expect(json.error).toBe(null);
      expect(json.data).toBeInstanceOf(Array);
      expect(json.data.length).toBeGreaterThan(0);
      expect(json.data[0]?.name).toBe('Tech Conference 2024');
    },
  });
});
