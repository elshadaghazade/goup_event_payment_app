import { prisma } from "@/prisma/prisma";
import { participantSelect } from "./selects";
import { CreateParticipantParamsType } from "@/app/interfaces/Participant";
import { participant_role_enum } from "@prisma/client";
import { ClientError } from "@/app/interfaces/ClientError";

export const createParticipant = async (params: CreateParticipantParamsType) => {
    try {
        if (
            !params.doc_no.trim()
            || !/.+@.+/gi.test(params.email)
            || !params.name.trim()
            || ![participant_role_enum.professional, participant_role_enum.student].includes(params.role)
        ) {
            throw new ClientError("BAD_REQUEST", 400);
        }

        return await prisma.$transaction(async tx => {

            const participant = await tx.participants.findFirst({
                where: {
                    email: {
                        equals: params.email.trim(),
                        mode: 'insensitive'
                    }
                }
            });

            if (participant) {
                return participant;
            }

            return await tx.participants.create({
                data: {
                    doc_no: params.doc_no,
                    email: params.email,
                    name: params.name,
                    role: params.role,
                    created_at: new Date()
                },
                ...participantSelect
            })
        });
        
    } catch (err) {
        throw err;
    }
}