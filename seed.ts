import { participant_role_enum } from '@prisma/client';
import {faker} from '@faker-js/faker';
import { prisma } from './prisma/prisma';

async function seed() {
    // Seed speakers
    const speakers = await Promise.all(
        Array.from({ length: 10 }, async () => {
            return prisma.speakers.create({
                data: {
                    email: faker.internet.email(),
                    name: faker.person.fullName(),
                    organization: faker.company.name(),
                    photo_url: faker.image.url(),
                    biography: faker.lorem.paragraphs(2),
                    created_at: faker.date.past(),
                    modified_at: faker.date.recent(),
                },
            });
        }),
    );

    // Seed events
    const events = await Promise.all(
        Array.from({ length: 5 }, async () => {
            return prisma.events.create({
                data: {
                    name: faker.lorem.words(3),
                    description: faker.lorem.sentence(),
                    location: faker.location.city(),
                    start_date: faker.date.future(),
                    end_date: faker.date.future(),
                    created_at: faker.date.past(),
                    modified_at: faker.date.recent(),
                },
            });
        }),
    );

    // Seed packages
    const packages = await Promise.all(
        events.map(event =>
            prisma.packages.create({
                data: {
                    event_id: event.id,
                    type: [participant_role_enum.professional, participant_role_enum.student][Math.floor(Math.random() * 2)],
                    price: faker.commerce.price({
                        min: 10,
                        max: 50
                    }),
                    description: faker.lorem.sentence(),
                    created_at: faker.date.past(),
                    modified_at: faker.date.recent(),
                },
            })
        ),
    );

    // Seed coupons
    const coupons = await Promise.all(
        speakers.map(speaker =>
            prisma.coupons.create({
                data: {
                    code: faker.string.uuid(),
                    speaker_id: speaker.id,
                    discount_percent: Math.floor(Math.random() * 15),
                    description: faker.lorem.sentence(),
                    valid_until: faker.date.future(),
                    created_at: faker.date.past(),
                    modified_at: faker.date.recent(),
                },
            })
        ),
    );

    // Seed participants
    const participants = await Promise.all(
        events.map(event =>
            prisma.participants.create({
                data: {
                    role: [participant_role_enum.professional, participant_role_enum.student][Math.floor(Math.random() * 2)],
                    name: faker.person.fullName(),
                    email: faker.internet.email(),
                    doc_no: faker.string.numeric({
                        length: 12
                    }),
                    event_id: event.id,
                    created_at: faker.date.past(),
                },
            })
        ),
    );

    console.log('Database seeded!');
}

seed()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        process.exit(0);
    });
