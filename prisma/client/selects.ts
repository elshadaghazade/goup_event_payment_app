import { Prisma } from "@prisma/client";

export const participantSelect: {select: Prisma.participantsSelect} = {
    select: {
        id: true,
        role: true,
        name: true,
        email: true,
        doc_no: true
    }
}

export const eventSelect: {select: Prisma.eventsSelect} = {
    select: {
        id: true,
        name: true,
        description: true,
        location: true,
        start_date: true,
        end_date: true,
        participants: participantSelect
    }
}

export const packageSelect: {select: Prisma.packagesSelect} = {
    select: {
        id: true,
        events: eventSelect,
        type: true,
        price: true,
        description: true
    }
}

export const paymentSelect: {select: Prisma.paymentsSelect} = {
    select: {
        id: true,
        participants: participantSelect,
        events: eventSelect,
        packages: packageSelect,
        amount: true,
        status: true,
        transaction_id: true,
        url: true,
        type: true
    }
}

