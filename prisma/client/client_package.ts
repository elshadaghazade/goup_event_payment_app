import { prisma } from "@/prisma/prisma";
import { packageSelect } from "./selects";
import { ClientError } from "@/app/interfaces/ClientError";

export const searchPackages = async (event_id: number) => {
    try {
        if (isNaN(Number(event_id))) {
            throw new ClientError("BAD_REQUEST", 400);
        }

        const events = await prisma.packages.findMany({
            where: {
                event_id: Number(event_id)
            },
            ...packageSelect
        });

        return events;
    } catch (err) {
        throw err;
    }
}