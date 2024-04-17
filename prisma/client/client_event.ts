import { prisma } from "@/prisma/prisma";
import { eventSelect } from "./selects";

export const searchEvents = async () => {
    try {
        const events = await prisma.events.findMany({
            where: {
                end_date: {
                    gte: new Date()
                }
            },
            ...eventSelect,
            orderBy: [
                {
                    start_date: 'desc'
                }
            ]
        });

        return events;
    } catch (err) {
        throw err;
    }
}